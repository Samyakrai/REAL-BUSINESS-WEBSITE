from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import sqlite3
from datetime import datetime
import os

# Database Setup
DB_FILE = 'feedback.db'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            message TEXT,
            date TEXT
        )
    ''')
    conn.commit()
    conn.close()
    print("Database initialized.")

class RequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/view-feedback':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute('SELECT * FROM feedbacks ORDER BY id DESC')
            rows = c.fetchall()
            conn.close()
            
            html = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Feedback Admin | RISE UP</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; background: #f4f4f4; }
                    table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
                    th { background-color: #333; color: white; }
                    tr:hover { background-color: #f5f5f5; }
                    .container { max-width: 1000px; margin: 0 auto; }
                    h1 { color: #333; }
                    .back-btn { display: inline-block; margin-bottom: 20px; padding: 10px 15px; background: #333; color: #ffcc00; text-decoration: none; border-radius: 4px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <a href="index.html" class="back-btn">← Back to Website</a>
                    <h1>Feedback Database Records</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
            """
            
            if not rows:
                html += "<tr><td colspan='5' style='text-align:center;'>No feedback received yet.</td></tr>"
            else:
                for row in rows:
                    html += f"<tr><td>{row[0]}</td><td>{row[4]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>"
            
            html += """
                        </tbody>
                    </table>
                </div>
            </body>
            </html>
            """
            self.wfile.write(html.encode('utf-8'))
        else:
            # Default behavior for serving static files
            super().do_GET()

    def do_POST(self):
        if self.path == '/submit-feedback':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                name = data.get('name')
                email = data.get('email')
                message = data.get('message')
                
                if name and email and message:
                    timestamp = datetime.now().strftime("%d/%m/%Y, %I:%M:%S %p")
                    
                    conn = sqlite3.connect(DB_FILE)
                    c = conn.cursor()
                    c.execute('INSERT INTO feedbacks (name, email, message, date) VALUES (?, ?, ?, ?)', 
                              (name, email, message, timestamp))
                    conn.commit()
                    conn.close()
                        
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {'status': 'success', 'message': 'Saved to Database'}
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                else:
                    self.send_error(400, "Missing required fields")
                    
            except Exception as e:
                print(f"Error processing feedback: {e}")
                self.send_error(500, "Internal Server Error")
        else:
            self.send_error(404, "Not Found")

def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
    init_db()
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    run()
