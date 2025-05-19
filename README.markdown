# Generador de Presentacions amb IA

Aquest projecte és una aplicació web que permet generar presentacions automàticament utilitzant intel·ligència artificial (IA). Els usuaris poden introduir un tema, especificar paràmetres com el to, l’audiència, l’idioma i el nombre de diapositives, i l’aplicació crea una presentació completa amb contingut, imatges generades per IA, preguntes per a l’audiència i una cita rellevant. Les presentacions es poden exportar en formats PDF, PPTX i JSON, i es guarden de manera persistent perquè es puguin recuperar després de refrescar la pàgina.

## Característiques principals

- Generació automàtica de presentacions amb contingut i imatges utilitzant l’API d’OpenAI.
- Interfície web intuïtiva amb un formulari per personalitzar les presentacions.
- Suggeriments de context basats en IA per ajudar els usuaris a definir millor el tema.
- Exportació en formats PDF, PPTX i JSON.
- Emmagatzematge persistent de presentacions en una base de dades SQLite.
- Optimització del rendiment amb crides asíncrones per a la generació d’imatges.

## Prerequisits

Abans de començar, assegura’t que tens instal·lats els següents components al teu sistema:

- **Python 3.9 o superior**:
  - Comprova la versió amb: `python --version` o `python3 --version`.
  - Si no el tens instal·lat:
    - **Linux (Ubuntu/Debian)**: `sudo apt-get update && sudo apt-get install python3 python3-pip`.
    - **macOS**: `brew install python` (necessites Homebrew instal·lat; instal·la’l amb `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`).
    - **Windows**: Descarrega’l des de [python.org](https://www.python.org/downloads/) i instal·la’l, assegurant-te de marcar "Add Python to PATH" durant la instal·lació.

- **pip** (gestor de paquets de Python):
  - Actualitza’l amb: `pip install --upgrade pip` o `python3 -m pip install --upgrade pip`.

- **Git** (opcional, per clonar el repositori):
  - **Linux (Ubuntu/Debian)**: `sudo apt-get install git`.
  - **macOS**: `brew install git`.
  - **Windows**: Descarrega’l des de [git-scm.com](https://git-scm.com/downloads) i instal·la’l.

- **Accés a Internet**: Necessari per descarregar dependències i connectar-te a l’API d’OpenAI.

- **Clau API d’OpenAI**:
  - Registra’t a [openai.com](https://platform.openai.com/signup) i obtén una clau API des del teu compte.
  - Guarda aquesta clau, ja que la necessitaràs per configurar el projecte.

- **Dependències del sistema per WeasyPrint** (necessari per exportar a PDF):
  - **Linux (Ubuntu/Debian)**:
    ```bash
    sudo apt-get install libcairo2 libpango1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info
    ```
  - **macOS**:
    ```bash
    brew install cairo pango gdk-pixbuf libffi
    ```
  - **Windows**:
    - Descarrega i instal·la [GTK+](https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer) per proporcionar les llibreries gràfiques necessàries.
    - Alternativament, pots utilitzar WeasyPrint a través de WSL (Windows Subsystem for Linux) si tens problemes.

## Instal·lació

Segueix aquests passos per instal·lar el projecte al teu sistema:

### 1. Clona o descarrega el repositori

- Si tens Git instal·lat, clona el repositori:
  ```bash
  git clone https://github.com/teu-usuari/generador-presentacions-ia.git
  cd generador-presentacions-ia
  ```
- Si no tens Git, descarrega manualment el codi font com a ZIP des del repositori i descomprimeix-lo en una carpeta. A continuació, obre una terminal i navega a la carpeta del projecte:
  ```bash
  cd /ruta/a/generador-presentacions-ia
  ```

### 2. Crea un entorn virtual

L’ús d’un entorn virtual és molt recomanable per evitar conflictes entre dependències de diferents projectes.

- Crea l’entorn virtual:
  ```bash
  python -m venv venv
  ```
  - En Linux/macOS: `python3 -m venv venv`.
  - En Windows: `python -m venv venv`.

- Activa l’entorn virtual:
  - **Linux/macOS**:
    ```bash
    source venv/bin/activate
    ```
  - **Windows**:
    ```bash
    venv\Scripts\activate
    ```
  Quan l’entorn estigui activat, veuràs `(venv)` al principi de la línia de comandes.

### 3. Instal·la les dependències

El projecte inclou un fitxer `requirements.txt` amb totes les llibreries necessàries. Instal·la-les amb:

```bash
pip install -r requirements.txt
```

Si no tens el fitxer `requirements.txt`, pots instal·lar les dependències manualment amb:

```bash
pip install Flask==2.3.2 openai==1.3.7 pydantic==2.4.2 python-pptx==0.6.21 weasyprint==60.1 aiohttp==3.8.5 requests==2.31.0 python-dotenv==1.0.0
```

- **Nota sobre WeasyPrint**: Si tens errors durant la instal·lació de `weasyprint`, assegura’t que les dependències del sistema estiguin instal·lades (vegeu la secció "Prerequisits"). Pots provar de reinstal·lar amb:
  ```bash
  pip install --force-reinstall weasyprint
  ```

### 4. Configura les variables d’entorn

Crea un fitxer `.env` a la carpeta principal del projecte per emmagatzemar les variables d’entorn necessàries:

- Obre un editor de text (com `nano`, `vim` o qualsevol editor gràfic) i crea el fitxer:
  ```bash
  nano .env
  ```
- Afegeix el següent contingut, substituint els valors corresponents:
  ```plaintext
  OPENAI_API_KEY=la_teva_clau_api_aqui
  SECRET_KEY=una_clau_secreta_forta_aqui
  ```
  - `OPENAI_API_KEY`: La clau API que has obtingut d’OpenAI.
  - `SECRET_KEY`: Una clau secreta per a Flask (pots generar-ne una amb Python executant `python -c "import secrets; print(secrets.token_hex(16))"`).

- Desa el fitxer i tanca l’editor (per exemple, a `nano`, prem `Ctrl+O`, `Enter` per desar, i `Ctrl+X` per sortir).

### 5. Crea la base de dades

El projecte utilitza SQLite per emmagatzemar presentacions i plantilles. Executa l’escript `database.py` per inicialitzar la base de dades:

```bash
python database.py
```

- Si no tens un fitxer `database.py`, assegura’t que el teu codi inclou aquesta funcionalitat dins de `app.py` o crea’l amb el següent contingut mínim:
  ```python
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

  if __name__ == "__main__":
      init_db()
      print("Base de dades inicialitzada correctament.")
  ```
- Desa’l com a `database.py` i torna a executar `python database.py`.

## Execució

Un cop instal·lat tot, pots executar l’aplicació amb els següents passos:

### 1. Inicia el servidor Flask

Amb l’entorn virtual activat, executa l’aplicació principal:

```bash
python app.py
```

- Si tot funciona correctament, veuràs un missatge com:
  ```
   * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
  ```

### 2. Accedeix a l’aplicació

- Obre un navegador web i ves a l’adreça:
  ```
  http://localhost:5000
  ```
- Hauries de veure la interfície principal amb un formulari per generar presentacions.

### 3. Utilitza l’aplicació

- **Generació de presentacions**:
  1. Introdueix un tema al camp corresponent (per exemple, "Introducció a la IA").
  2. Selecciona opcions com el nombre de diapositives, to, audiència, idioma, tipus de presentació i tema visual.
  3. Opcionalment, activa o desactiva la generació d’imatges (desactivar-la accelera el procés).
  4. Fes clic a "Generar Presentació".
  5. Revisa la vista prèvia de les diapositives, navega entre elles i consulta les preguntes i la cita generades.

- **Exportació**:
  - Fes clic als botons "PDF", "PPTX" o "JSON" per descarregar la presentació en el format desitjat.

- **Persistencia**:
  - Refresca la pàgina per veure l’opció de carregar l’última presentació generada. Pots carregar-la o eliminar-la.

### 4. Tanca l’aplicació

- Quan vulguis aturar el servidor, prem `Ctrl+C` a la terminal.
- Desactiva l’entorn virtual amb:
  ```bash
  deactivate
  ```

## Resolució de problemes

Aquí tens algunes solucions a problemes comuns que poden sorgir:

- **Error: "No module named 'weasyprint'"**:
  - Assegura’t que has instal·lat les dependències del sistema (vegeu "Prerequisits"). Reinstal·la `weasyprint` amb:
    ```bash
    pip install --force-reinstall weasyprint
    ```

- **Error: "Invalid API key" o problemes amb OpenAI**:
  - Verifica que la clau API d’OpenAI al fitxer `.env` sigui correcta i que tens crèdit disponible al teu compte d’OpenAI.
  - Comprova la connexió a Internet.

- **Error: "sqlite3.OperationalError: no such table"**:
  - Executa `python database.py` per inicialitzar la base de dades abans de fer servir l’aplicació.

- **Lentitud en la generació d’imatges**:
  - Desactiva l’opció "Incluir imatges" al formulari per ometre la generació d’imatges.
  - Si necessites imatges, assegura’t que la connexió a Internet sigui ràpida i estable.

- **Problemes amb exportació a PDF**:
  - Si el PDF no inclou imatges, verifica que tens accés a Internet quan exportes, ja que WeasyPrint necessita descarregar les imatges des de les URLs generades per OpenAI.

## Estructura del projecte

Una breu descripció dels fitxers principals:

- `app.py`: Fitxer principal de l’aplicació Flask que conté les rutes i la lògica del backend.
- `database.py`: Script per inicialitzar la base de dades SQLite.
- `templates/index.html`: Plantilla HTML per a la interfície principal.
- `templates/slide_template.html`: Plantilla HTML per a l’exportació a PDF.
- `static/scripts.js`: Script JavaScript per a la interactivitat de la interfície.
- `requirements.txt`: Llista de dependències del projecte.
- `.env`: Fitxer de configuració per a variables d’entorn (no inclòs al repositori per seguretat).

## Contribucions

Si vols contribuir al projecte, pots fer-ho seguint aquests passos:

1. Fes un fork del repositori.
2. Crea una branca nova: `git checkout -b nova-funcionalitat`.
3. Fes els teus canvis i commit: `git commit -m "Afegida nova funcionalitat"`.
4. Puja els canvis: `git push origin nova-funcionalitat`.
5. Crea un pull request al repositori original.

## Llicència

Aquest projecte està sota la llicència GarolaCorp. Consulta el fitxer `LICENSE` per a més detalls (si existeix).



---
*Data de l’última actualització: 19 de maig de 2025, 15:46 CEST*