# ChatGPT FinRL Jupyter Notebook

## Pre-requisites

Clone this repository using the following command:

```bash
git clone https://github.com/TradingAlfredBot/alfred-bot-notebook.git
```

Move to the correct directory:

```bash
cd alfred-bot-notebook
```

---

## Create Docker Image

Login to Dockerhub using the following command. Here we're using `alfreddevteam` Dockerhub account as an example.

```bash
docker login -u alfreddevteam
```

Use the following command to build the Docker image:

```bash
docker build -t alfreddevteam/chatgpt-finrl-bot:latest docker
```

Push the built Docker image to Dockerhub:

```bash
docker push alfreddevteam/chatgpt-finrl-bot:latest
```

---

## Deploy Node.js Docker API

Move to the directory containing API code:

```bash
cd api
```

Install `nvm` using the following command:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm -v
```

Install `nodejs` and `npm` using the following command:

```bash
nvm install lts/iron
node -v
npm -v
```

Install the dependencies using the following command:

```bash
npm i
npm install pm2@latest -g
```

Start the API:

```bash
pm2 start src/index.js
```

Check the status:

```bash
pm2 status
```

The API will now be available to use at `http://<your_ip>:3000`.

---