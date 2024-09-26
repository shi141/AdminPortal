from flask import Flask, jsonify
import pyodbc

app = Flask(__name__)

# Database connection configuration
server = 'SRISHTI\MSSQLSERVER01'
database = 'user'
driver = '{ODBC Driver 17 for SQL Server}'  # or another driver you have installed

connection_string = f'DRIVER={driver};SERVER={server};DATABASE={database};Trusted_Connection=yes;'


# conn = pyodbc.connect(connection_string)
# print("Connection successful")
# conn.close()


def get_db_connection():
    conn = pyodbc.connect(connection_string)
    return conn

@app.route('/')
def get_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM userdata;')
    rows = cursor.fetchall()
    conn.close()
    # return rows
    data = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)


