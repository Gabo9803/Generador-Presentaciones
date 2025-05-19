import sqlite3

def init_db():
    conn = sqlite3.connect('presentations.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prompt_templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            content TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS presentations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_prompt_template(name, content):
    conn = sqlite3.connect('presentations.db')
    conn.execute('INSERT INTO prompt_templates (name, content) VALUES (?, ?)', (name, content))
    conn.commit()
    conn.close()

def get_prompt_templates():
    conn = sqlite3.connect('presentations.db')
    cursor = conn.execute('SELECT name, content FROM prompt_templates')
    templates = [{"name": row[0], "content": row[1]} for row in cursor.fetchall()]
    conn.close()
    return templates