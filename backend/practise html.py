from flask import Flask,render_template,request,redirect,url_for,session,jsonify,make_response,send_file,send_from_directory
from flask_cors import CORS,cross_origin
import pyodbc
from flask_bcrypt import Bcrypt
import jwt
from flask_jwt_extended import JWTManager,create_access_token,jwt_required,get_jwt_identity,get_jwt
import time
from datetime import datetime,timedelta
import os
from io import BytesIO
import csv
import pandas as pd;


app = Flask(__name__,template_folder="template")
jwt = JWTManager(app)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app,methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
bcrypt=Bcrypt(app)
app.config['SECRET_KEY'] = 'your_strong_secret_key'
app.config["JWT_SECRET_KEY"] = 'your_jwt_secret_key'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['CORS_HEADERS'] = 'Content-Type'
server = 'SRISHTI\MSSQLSERVER01'
database = 'user'
driver = '{ODBC Driver 17 for SQL Server}'  # or another driver you have installed

connection_string = f'DRIVER={driver};SERVER={server};DATABASE={database};Trusted_Connection=yes;'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
 

# pw_hash = bcrypt.generate_password_hash('hunter2')
# bcrypt.check_password_hash(pw_hash, 'hunter2')

def get_db_connection():
    conn = pyodbc.connect(connection_string)
    return conn

# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000/"}})


@app.route('/')  
@jwt_required()
def get_data():
    # if request.method=="POST":
    current_user=get_jwt_identity()
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM userdata;')
    rows = cursor.fetchall()
    results = [tuple(row) for row in rows]
    conn.close()
    row=[]
    for x in results:
        dict={}
        dict.update({'id':x[0]})
        dict.update({'name':x[1]})
        dict.update({'department':x[2]})
        dict.update({'email':x[3]})
        dict.update({'role':x[4]})
        dict.update({'contact':x[5]})
        row.append(dict)
    response=jsonify(row)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/progress_details/<int:project_id>',methods=['GET'])
@jwt_required()
def progress_details(project_id):
    project_id=project_id
    print(project_id)
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    query="select project_progress.progress_id,project_progress.progress_date,project_progress.amount_completed,authorised_admin_login.login_name from project_progress inner join authorised_admin_login on authorised_admin_login.id=project_progress.added_by_id  where project_id=(?)"
    cursor.execute(query,(project_id))
    result=cursor.fetchall()
    cursor.close()
    conn.close()
    progress_detail=[]
    for i in result:
        dictionary={}
        dictionary['progress_id']=i[0]
        date=i[1].strftime('%Y-%m-%d')
        dictionary['progress_date']=date
        dictionary['amount_completed']=i[2]
        dictionary['created_by']=i[3]
        progress_detail.append(dictionary)
    response=jsonify(progress_detail)
    print(progress_detail)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/admin',methods=['GET'])
def admin():
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    query="select authorised_admin_login.id,authorised_admin_login.login_name,authorised_admin_login.login_role,progress.name,progress.date_created,progress.project_id from authorised_admin_login inner join progress on authorised_admin_login.id=progress.creation_id;"
    cursor.execute(query)
    result=cursor.fetchall()
    cursor.commit()
    query="select "
    list_of_login=[]
    for data in result:
        dictionary={}
        if(data[2]!="Guest"):
            dictionary['id']=data[0]
            dictionary['name']=data[1]
            dictionary['role']=data[2]
            dictionary['project_id']=data[5]
            dictionary['project']=data[3]
            dictionary['date']=data[4].strftime('%Y-%m-%d')
        list_of_login.append(dictionary)
    list_of_login=[d for d in list_of_login if d]
    response=jsonify(list_of_login)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


@app.route('/project/<int:id>',methods=['GET'])
@jwt_required()
def project(id):
    project_id=id
    print(project_id)
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    query="select * from progress where project_id=(?)"
    cursor.execute(query,(project_id))
    result=cursor.fetchall()
    cursor.close()
    conn.close()
    progress_detail=[]
    print(result)
    dictionary={}
    for i in result:
        
        dictionary['name']=i[0]
        dictionary['amount']=i[1]
        dictionary['cost']=i[2]
        dictionary['start_date']=i[3].strftime('%Y-%m-%d')
        dictionary['end_date']=i[4].strftime('%Y-%m-%d')
        dictionary['created_by']=i[5]
        dictionary['progress_percentage']=i[6]
        dictionary['amount_completed']=i[7]
        # date=i[2].strftime('%Y-%m-%d')
    response=jsonify(dictionary)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response



@app.route('/add_progress',methods=['POST'])
@jwt_required()
def add_progress():
    user=get_jwt_identity()
    username=user['public_id']
    data=request.get_json()
    print(data)
    date_obj = datetime.strptime(data['progress_date'],  '%Y-%m-%dT%H:%M:%S.%fZ')
    progress_date = date_obj.strftime('%Y-%m-%d')
    try:
        conn=pyodbc.connect(connection_string)
        cursor=conn.cursor()
        query="select login_role,id from authorised_admin_login where username=(?)"
        cursor.execute(query,(username,))
        result=cursor.fetchone()
        cursor.close()
        conn.close()
        print(result[0])
        role=result[0]
        id=result[1]
        if role=="Editor" or role=="Admin":
            conn=pyodbc.connect(connection_string)
            cursor=conn.cursor()
            query="insert into project_progress(project_id,progress_date,amount_completed,added_by_id) values(?,?,?,?)"
            cursor.execute(query,(data['project_id'],progress_date,data['amount_completed'],id,))
            cursor.commit()
            cursor.close()
            conn.close()
            amount_completed=data['amount_completed']
            project_id=data['project_id']
            # progress_id=data['progress_id']
            # SELECT `id` FROM `table` ORDER BY `date added` DESC LIMIT 10
            conn=pyodbc.connect(connection_string)
            cursor=conn.cursor()
            query=("select progress_id from project_progress where project_id=(?) ORDER BY progress_date DESC ;")
            cursor.execute(query,(project_id,))
            result=cursor.fetchone()
            progress_id=result[0]
            cursor.close()
            conn.close()
            # amount_completed=int(result[0])
            # project_id=data['project_id']
            # progress_id=result[1]
            dictionary={'amount_completed':amount_completed,'project_id':project_id,'progress_id':progress_id}
            # dictionary={'amount_completed':amount_completed,'project_id':project_id}

            conn=pyodbc.connect(connection_string)
            cursor=conn.cursor()
            query=("select * from progress where project_id=(?);")
            cursor.execute(query,(project_id,))
            result=cursor.fetchall()
            print(result)
            cursor.close()
            conn.close()
            for i in result:
                amount=i[1]
                progress_amount=i[7]
                
            amount_completed=int(amount_completed)
            update_amount=progress_amount+amount_completed
            print(update_amount,amount,amount-update_amount)
            percentage=(((update_amount)/amount)*100)
            update_percentage=(str(round(percentage,2)))
            print(update_percentage)
            progress_percentage=update_percentage+"%"
            print(progress_percentage)
            if (amount>=update_amount):
                conn=pyodbc.connect(connection_string)
                cursor=conn.cursor()
                query=("UPDATE progress SET progress.progress_amount =(?),progress.progress_percentage=(?) FROM progress P JOIN project_progress R ON P.project_id = R.project_id WHERE P.project_id = (?) AND R.progress_id = (?);")
                cursor.execute(query,(update_amount,progress_percentage,project_id,progress_id,))
                cursor.commit()
                cursor.close()
                conn.close()
            conn=pyodbc.connect(connection_string)
            cursor=conn.cursor()
            query="select * from progress where project_id=(?)"
            cursor.execute(query,(project_id,))
            result=cursor.fetchone()
            cursor.close()
            conn.close()
            print(result)
            new_dictionary={}
            
            new_dictionary['name']=result[0]
            new_dictionary['amount']=result[1]
            new_dictionary['cost']=result[2]
            new_dictionary['start_date']=result[3].strftime('%Y-%m-%d')
            new_dictionary['end_date']=result[4].strftime('%Y-%m-%d')
            new_dictionary['created_by']=result[5]
            new_dictionary['progress_percentage']=result[6]
            new_dictionary['progress_amount']=result[7]
            new_dictionary['id']=result[8]
            response=make_response(new_dictionary)
            response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type") 
            return response
        else:
            return jsonify("no")

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500
    


@app.route('/add_project',methods=['POST'])
@jwt_required()
def add_project():
    user=get_jwt_identity()
    username=user['public_id']
    data=request.get_json()
    try:
        conn=pyodbc.connect(connection_string)
        cursor=conn.cursor()
        query="select login_name,login_role,id from authorised_admin_login where username=(?);"
        cursor.execute(query,(username,))
        result=cursor.fetchone()
        conn.close()
        if(result):
            created_by=result[0]
            role=result[1]
            id=result[2]
            date_obj = datetime.strptime(data['start_date'],  '%Y-%m-%dT%H:%M:%S.%fZ')
            start_date = date_obj.strftime('%Y-%m-%d')
            date_obj = datetime.strptime(data['end_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
            end_date = date_obj.strftime('%Y-%m-%d')
            print(created_by,role)
            dictionary={'name':data['name'],'amount':data['amount'],'cost':data['cost'],'start_date':start_date,'end_date':end_date,'created_by':created_by,'id':id}
            if(role=="Admin" or role=="Editor"):
                conn=pyodbc.connect(connection_string)
                cursor=conn.cursor()
                creation_date=datetime.today().strftime('%Y-%m-%d')
                query="insert into progress(name,amount,cost,start_date,end_date,created_by,creation_id,date_created) values(?,?,?,?,?,?,?,?);"
                cursor.execute(query,(data['name'],data['amount'],data['cost'],start_date,end_date,created_by,id,creation_date,))
                conn.commit()
                cursor.close()
                conn.close()
                new_dictionary={}
                conn=pyodbc.connect(connection_string)
                cursor=conn.cursor()
                query="select * from progress where name=(?) and amount=(?) and cost=(?) and start_date=(?) and end_date=(?) and created_by=(?) order by start_date desc ;"
                cursor.execute(query,(data['name'],data['amount'],data['cost'],start_date,end_date,created_by,))
                result=cursor.fetchone()
                cursor.close()
                conn.close()
                print(result)
                
                new_dictionary['name']=result[0]
                new_dictionary['amount']=result[1]
                new_dictionary['cost']=result[2]
                new_dictionary['start_date']=result[3].strftime('%Y-%m-%d')
                new_dictionary['end_date']=result[4].strftime('%Y-%m-%d')
                new_dictionary['created_by']=result[5]
                new_dictionary['progress_percentage']=result[6]
                new_dictionary['progress_amount']=result[7]
                new_dictionary['id']=result[8]
                print(result[8])
                print(new_dictionary)
                # return jsonify("Added succesfully")
                response=make_response(new_dictionary)
                response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
                response.headers.add("Access-Control-Allow-Headers", "Content-Type") 
                return response
            else:
                return jsonify({'error':'Unauthorised Access'}),401
        else:
            return jsonify({'error':'database error'}),500
        
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500
    



@app.route('/project_details',methods=['GET'])
@jwt_required()
def project_details():
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    cursor.execute("select * from progress;")
    result=cursor.fetchall()
    conn.close()
    row=[]
    print(result)
    for x in result:
        dict={}
        print(x[0])
        print(type(x[3]))
        dict.update({'name':x[0]})
        dict.update({'amount':x[1]})
        dict.update({'cost':x[2]})
        dict.update({'start_date':x[3].strftime('%Y-%m-%d')})
        dict.update({'end_date':x[4].strftime('%Y-%m-%d')})
        dict.update({'created_by':x[5]})
        dict.update({'progress_percentage':x[6]})
        dict.update({'progress_amount':x[7]})
        dict.update({'id':x[8]})
        row.append(dict)
    response=jsonify(row)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


@app.route('/register' ,methods=['POST'])
def register():
    data=request.get_json()
    name=data['login_name']
    role=data['login_role']
    username=data['username']
    password=data['password']
    name=name.capitalize()
    role=role.capitalize()
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    query="insert into authorised_admin_login(login_name,login_role,username,password) values(?,?,?,?);"
    cursor.execute(query,(name,role,username,password,))
    conn.commit()
    cursor.execute("select * from authorised_admin_login;")
    result=cursor.fetchall()
    print(result)
    conn.close() 
    response=jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/delete_user/<int:id>',methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user=get_jwt_identity()
    username=user['public_id']
    print(f"Username: {username}")
    try:
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        query = "SELECT login_role FROM authorised_admin_login WHERE username = ?;"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        conn.close()
        print(result)
        print(result[0])
        if (result[0]=='Admin'):
            print("successful")
        else:
            return jsonify({"error": "Not an admin"}), 401
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        query = "DELETE FROM userdata WHERE id = ?"
        cursor.execute(query, (id,))
        conn.commit()
        conn.close()
        response = make_response("User deleted")
        response.headers.add("Access-Control-Allow-Methods", "DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        data = response.data.decode('utf-8')
        return jsonify({'message': data})
    except pyodbc.Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error"}), 500

@app.route('/homepage',methods=['GET'])
@jwt_required()
def homepage():
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    admin=0
    project=0
    user=0
    dictionary={}
    query_admin="select * from authorised_admin_login"
    cursor.execute(query_admin)
    admin_result=cursor.fetchall()
    print(admin_result)
    
    if (admin_result[2]!="Guest"):
        for i in admin_result:
            admin+=1

    query_user='select * from userdata'
    cursor.execute(query_user)
    user_result=cursor.fetchall()
    for i in user_result:
        user+=1
    query_project="select * from progress"
    cursor.execute(query_project)
    project_result=cursor.fetchall()
    for i in project_result:
        project+=1
    dictionary['admin']=admin
    dictionary['user']=user
    dictionary['project']=project
    cursor.close()
    conn.close()
    response=jsonify(dictionary)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response




@app.route('/add_user',methods=['POST'])
@jwt_required()
def add_user():
    data=request.get_json()
    name = data["name"].capitalize()
    email = data['email']
    department = data['department'].capitalize()
    role = data['role'].capitalize()
    contact = data['numb']
    print(contact)
    contact=int(contact)
    print(contact)
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()
    query = "INSERT INTO userdata (name, email, department, role, contact) VALUES (?,?,?,?,?);"
    cursor.execute(query, (name, email, department, role, contact))
    conn.commit()
    print(name,email,department,role,contact)
    print(type(name),type(email),type(department),type(role),type(contact))
    query = "select * from userdata where name=? AND email=? AND department=? AND role=? AND contact=?;"
    cursor.execute(query, (name,email,department,role,contact,))
    result=cursor.fetchall()
    conn.commit()
    print(result)
    conn.close()
    dictionary={}
    for i in result:
        dictionary['id']=i[0]
        dictionary['name']=i[1]
        dictionary['department']=i[2]
        dictionary['email']=i[3]
        dictionary['role']=i[4]
        dictionary['contact']=i[5]
    print(dictionary)
    response=make_response(dictionary)
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response



@app.route('/edit_user/<int:user_id>',methods=['PUT'])
@jwt_required()
@cross_origin()
def edit_user(user_id):
    user=get_jwt_identity()
    username=user['public_id']
    try:
        conn=pyodbc.connect(connection_string)
        cursor=conn.cursor()
        query="select login_role from authorised_admin_login where username=?;"
        cursor.execute(query,(username,))
        result=cursor.fetchone()
        conn.close()
        if (result[0]=='Admin' or result[0]=='Editor'):
            print("Admin approved")
        else:
            return jsonify({{'error':'Not an admin'}}),404
        data=request.get_json()
        print("edit user")
        print(data)
        id=user_id
        name = data["name"]
        email = data['email']
        department = data['department']
        role = data['role']
        contact = data['contact']
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        query = "UPDATE userdata SET name = ?, email = ?,department=?,role=?,contact=? where id=?;"
        cursor.execute(query, (name, email, department, role, contact,id))
        conn.commit()
        updated_dict={'id':id,'name':name,'email':email,'department':department,'role':role,'contact':contact}
        print("query")
        conn.close()
        # return jsonify({updated_dict}),200
        response = make_response(updated_dict)
        response.headers.add("Access-Control-Allow-Methods", "PUT, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response
    except pyodbc.Error as e:
        print(f"Database Error {e}")
        return jsonify({"error":"database error"}),500


@app.route('/login',methods=["POST"])

def login():
    data=request.get_json()
    username=data['username']
    password=data['password']
    # print(data['password'])
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    query="select * from authorised_admin_login;"
    cursor.execute(query) 
    result=cursor.fetchall()
    conn.commit()
    user=[]
    for i in result:
        dict={}
        dict['id']=i[0]
        dict['login_name']=i[1]
        dict['login_role']=i[2]
        dict['username']=i[3]
        dict['password']=i[4]
        user.append(dict)
    print(user)
    # user_username=
    # pw_hash=bcrypt.generate_password_hash(user[1]['password'])
    # print(pw_hash)
    for i in user:
        if(i['username']!=username) :
            # print("wrong usrername")
            pass
        else:
            if(bcrypt.check_password_hash(bcrypt.generate_password_hash(i['password']),password)):
                token=create_access_token(identity={'public_id': i['username']}, expires_delta=timedelta(minutes=30))
                print(token)
                string="Welcome !"

            else:
                print("wrong password")
    return jsonify({'message':string,'access_token': token})


@app.route('/add_file',methods=['GET'])
def add_file():
    list_upload=os.listdir('c:\\Users\\kandp\\Desktop\\practise\\uploads')
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    filename = file.filename
    filename_without_ext, ext = os.path.splitext(filename)
    timestamp = int(time.time())
    new_filename = f"{filename_without_ext}_{timestamp}{ext}"
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    query="insert into files(file_name) values (?);"
    cursor.execute(query,(new_filename,))
    conn.commit()
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
    file.save(file_path)
   
    # You can save the file here or handle it as per your requirement
    print("Received:", file.filename)
    return jsonify({"message": "File received successfully"}), 200

@app.route('/upload_csv',methods=['POST'])
@jwt_required()
def upload_csv():
    upload=request.files['file']
    print(upload)
    if upload.filename!="":
        try:
            upload.save(f'./upload_csv/{upload.filename}')
            read_csv()
            return{'filename':upload.filename},201
        
        except Exception as err:
            return {"errors":[str(err)]},422
    return{"errors":["missing filename"]},422

def validate_row(row):
    try:
        if not (row[0]).isdigit() or pd.isnull(row[1]):  
            return False
        if not (row[1]).isdigit() or pd.isnull(row[1]) or int(row[1])>100:  
            return False
        if not (row[2]).isdigit() or pd.isnull(row[1]) or int(row[2])>100:  
            return False
        if not (row[3]).isdigit() or pd.isnull(row[1]) or int(row[3])>100:  
            return False
        if not (row[4]).isdigit() or pd.isnull(row[1]) or int(row[4])>100:  
            return False
        if not (row[5]).isdigit() or pd.isnull(row[1]) or int(row[5])>100:  
            return False
        if not (row[6]).isdigit() or pd.isnull(row[1]) or int(row[6])>100:  
            return False
        return True
    except IndexError:
        return False

@app.route('/read_csv', methods=['GET'])
@jwt_required()
def read_csv():
    valid_rows = []
    invalid_rows = []
    print(valid_rows)
    try:
        with open('./upload_csv/subjects.csv', 'r') as csvFile:
            csv_reader = csv.reader(csvFile)
            next(csv_reader, None) 

            for row in csv_reader:
                if validate_row(row):
                    valid_rows.append(row)
                else:
                    invalid_rows.append(row)

        if valid_rows:
            conn = pyodbc.connect(connection_string)
            cursor = conn.cursor()

            for row in valid_rows:
                try:
                    query = "INSERT INTO student_data VALUES (?,?,?,?,?,?,?);"
                    cursor.execute(query, int(row[0]),int(row[1]), int(row[2]), int(row[3]), int(row[4]), int(row[5]), int(row[6]))  

                except Exception as insert_error:
                    print(f"Error inserting row {row}: {insert_error}")

            conn.commit()
            cursor.close()
            conn.close()

        return jsonify({"message": "CSV processed", "valid_rows": len(valid_rows), "invalid_rows": len(invalid_rows)})

    except FileNotFoundError:
        return jsonify({"error": "CSV file not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/read_csv_data',methods=['GET'])
@jwt_required()
def read_csv_data():
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    query="select * from student_data;"
    cursor.execute(query)
    result=cursor.fetchall()
    cursor.close()
    conn.close()
    arr=[]
    for i in result:
        dict={}
        dict['student_ID']=i[0]
        dict['s_101']=i[1]
        dict['s_102']=i[2]
        dict['s_103']=i[3]
        dict['s_104']=i[4]
        dict['s_105']=i[5]
        dict['s_106']=i[6]
        arr.append(dict)
    response=jsonify(arr)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/list_file/<file>' ,methods=['GET'])
def list_file(file):
    list_upload=os.listdir('c:\\Users\\kandp\\Desktop\\practise\\uploads')
    conn=pyodbc.connect(connection_string)
    cursor=conn.cursor()
    query="select * from files;"
    cursor.execute(query)
    result=cursor.fetchall()
    conn.commit()
    print(result)
    uploads_dir = os.path.join(app.root_path, 'uploads')
    return send_from_directory(uploads_dir, file)

    # for i in list_upload:
@app.route('/view_uploads',methods=['GET'])
def view_uploads():
    list_upload=os.listdir('c:\\Users\\kandp\\Desktop\\practise\\uploads')
    return(jsonify(list_upload))

if __name__=="__main__":
    app.run(debug=True,port=800)