FROM continuumio/miniconda3

RUN apt-get update && \
    apt-get install g++ swig curl jq -y && \
    conda install -c conda-forge jupyter && \
    mkdir /opt/notebooks

WORKDIR /opt/notebooks

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY Art-ChatGPT-FinRL-Bot.ipynb .

RUN jupyter nbconvert -y --allow-errors --execute --to python Art-ChatGPT-FinRL-Bot.ipynb

COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

CMD ["/opt/notebooks/entrypoint.sh"]
