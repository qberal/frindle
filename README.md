# README

## Description

This project uses the Sharewood API to automatically send books to a Kindle device. It also utilizes qBittorrent to download torrents and leverages its tagging system to retrieve new files from the watch folder once they are downloaded.

## Prerequisites

- Docker
- Docker Compose

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```dotenv
SHAREWOOD_API_KEY=your_sharewood_api_key
QBITTORRENT_URL=http://your_qbittorrent_url
QBITTORRENT_USERNAME=your_qbittorrent_username
QBITTORRENT_PASSWORD=your_qbittorrent_password
MAIL_SMTP_HOST=smtp.mail.me.com
MAIL_SMTP_PORT=587
MAIL_SMTP_USER=your_smtp_user
MAIL_SMTP_PASS=your_smtp_password
MAIL_SMTP_FROM=your_email@example.com
KINDLE_EMAIL=your_kindle_email@example.com
WATCH_FOLDER=/root/books
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

## Running the Application with Docker Compose

1. **Navigate to the project directory:**

    ```sh
    cd path/to/your/project
    ```
   
2. **Edit the `docker-compose.yml` file:**

    - Update the volumes for the `backend` service to map the watch folder to your local directory where qbittorrent saves the downloaded files.

2. **Build and run the Docker containers:**

    ```sh
    docker-compose up --build
    ```

## How It Works

1. **Sharewood API:**
    - The application uses the Sharewood API to find books.

2. **qBittorrent:**
    - The application connects to qBittorrent to download torrents.
    - It uses qBittorrent's tagging system to monitor and retrieve new files from the watch folder once they are downloaded.

3. **Email:** 
    - The application sends the downloaded books to the Kindle email address.
    - The email is sent using the SMTP server details provided in the `.env` file.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
