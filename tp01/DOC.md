---
title: 'TP01 - Initialisation Docker'
disqus: hackmd
---

Initialisation Docker
===
![downloads](https://img.shields.io/github/downloads/atom/atom/total.svg)
![build](https://img.shields.io/appveyor/ci/:user/:repo.svg)
![chat](https://img.shields.io/discord/:serverId.svg)

## Table of Contents

[TOC]

## Installation de docker 

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04


## Installation de docker compose

https://docs.docker.com/compose/install/

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04

## Commandes à tester 

● docker run hello-world
Hello-world d’exemple avec Docker

```bash=
jere@jere-cours-conten:~/Documents/conteneur$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete 
Digest: sha256:c77be1d3a47d0caf71a82dd893ee61ce01f32fc758031a6ec4cf1389248bb833
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

● docker run -it ubuntu bash
Création d’un conteneur et utilisation d’un bash en interactif
exit ou Ctrl+D - Pour sortir du conteneur

```bash=
jere@jere-cours-conten:~/Documents/conteneur$ sudo docker run -it ubuntu bash
Unable to find image 'ubuntu:latest' locally
latest: Pulling from library/ubuntu
6e3729cf69e0: Pull complete 
Digest: sha256:27cb6e6ccef575a4698b66f5de06c7ecd61589132d5a91d098f7f3f9285415a9
Status: Downloaded newer image for ubuntu:latest

root@48bd34a11c40:/# 
```

● docker images
Afficher les images Docker disponibles en local

```bash=
jere@jere-cours-conten:~/Documents/conteneur$ sudo docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
ubuntu        latest    6b7dfa7e8fdb   6 days ago      77.8MB
hello-world   latest    feb5d9fea6a5   14 months ago   13.3kB
```


● docker ps -a
Affiche tous les conteneurs (en exécution ou pas, grâce à l’option -a)

```bash=
jere@jere-cours-conten:~/Documents/conteneur$ sudo docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED              STATUS                            PORTS     NAMES
48bd34a11c40   ubuntu        "bash"     About a minute ago   Exited (130) About a minute ago             adoring_dijkstra
9e2df1ddacc9   hello-world   "/hello"   5 minutes ago        Exited (0) 5 minutes ago                    peaceful_black
```


● docker run -p 80:80 nginx et docker run -p -d 80:80 nginx
Démarre un se

```bash=
jere@jere-cours-conten:~/Documents/conteneur$ sudo docker run -p 80:80 nginx
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
2022/12/15 09:10:45 [notice] 1#1: using the "epoll" event method
2022/12/15 09:10:45 [notice] 1#1: nginx/1.23.3
2022/12/15 09:10:45 [notice] 1#1: built by gcc 10.2.1 20210110 (Debian 10.2.1-6) 
2022/12/15 09:10:45 [notice] 1#1: OS: Linux 5.15.0-56-generic
2022/12/15 09:10:45 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2022/12/15 09:10:45 [notice] 1#1: start worker processes
2022/12/15 09:10:45 [notice] 1#1: start worker process 28
2022/12/15 09:10:45 [notice] 1#1: start worker process 29
2022/12/15 09:10:45 [notice] 1#1: start worker process 30
172.17.0.1 - - [15/Dec/2022:09:11:37 +0000] "GET / HTTP/1.1" 200 615 "-" "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0" "-"
172.17.0.1 - - [15/Dec/2022:09:11:37 +0000] "GET /favicon.ico HTTP/1.1" 404 153 "http://localhost/" "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0" "-"
2022/12/15 09:11:37 [error] 29#29: *1 open() "/usr/share/nginx/html/favicon.ico" failed (2: No such file or directory), client: 172.17.0.1, server: localhost, request: "GET /favicon.ico HTTP/1.1", host: "localhost", referrer: "http://localhost/"
```
> Résultat sur l'adresse : **localhost:80**

![](https://i.imgur.com/h40vR5V.png)




# TP01 : Serveur web

> Exécuter un serveur web (apache, nginx, …) dans un conteneur docker


## Récupérer l’image sur le Docker Hub

Dans un premier temps, il faut aller récupérer l'image de Nginx sur le site : https://hub.docker.com/_/nginx

Exécuter la commande suivante : docker pull nginx

```bash=
jere@jere-cours-conten:~/Documents/conteneur$ sudo docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
Digest: sha256:75263be7e5846fc69cb6c42553ff9c93d653d769b94917dbda71d42d3f3c00d3
Status: Image is up to date for nginx:latest
docker.io/library/nginx:latest
```

## Vérifier que cette image est présente en local

Pour vérifier la précense de l'image en local, il suffit d'exécuter la commande suivante : 

```bash=
jere@jere-cours-conten:~/Documents/conteneur$ sudo docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
nginx         latest    3964ce7b8458   32 hours ago    142MB
ubuntu        latest    6b7dfa7e8fdb   6 days ago      77.8MB
hello-world   latest    feb5d9fea6a5   14 months ago   13.3kB
```


## Créer un fichier index.html simple

Création du fichier index.html 

* Démarrer un conteneur et servir la page html créée précédemment à l’aide  d’un volume (option -v de docker run)

```bash=
jere@LAPTOP-ADMIN:~/cours-cloud/conteneur-cours/repo-tp-conteneurisation/tp01$ sudo docker run -v index.html:/usr/share/nginx/html -p 80:80 nginx
```

* Supprimer le conteneur précédent et arriver au même résultat que précédemment à l’aide de la commande docker cp



# 6 - Builder une image

* A l’aide d’un Dockerfile, créer une image (commande docker build)
```bash=
FROM nginx:latest

COPY index.html /usr/share/nginx/html
```

* Exécuter cette nouvelle image de manière à servir la page html (commande docker run)

```bash=
docker built -t nginx_ynov .

docker run -d --name nginx_ynov -p 9100:80 nginx_ynov
```


* Quelles différences observez-vous entre les procédures 5. et 6. ? Avantages et inconvénients de l’une et de l’autre méthode ? (Mettre en relation ce qui est observé avec ce qui a été présenté pendant le cours)

La difference est que sur procédure n°6, on renseigne directement l'image et le volume dans le fichier Dockerfile alors que sur la procèdure n°5 on entre le port et le volume lorsqu'on lance la commande docker run.

De plus, l'image se renseigne dans le fichier pour la procèdure n°6 alors que sur la procèdure 5 on télécharge l'image à l'aide de la commande docker pull.


# 7 - Utiliser une base de données dans un conteneur docker

* Récupérer les images mysql:5.7 et phpmyadmin/phpmyadmin depuis le Docker Hub

Récupération image mysql
```bash=
jere@LAPTOP-ADMIN:~/cours-cloud/conteneur-cours/tp01/srvnginx$ docker pull mysql:5.7.40
5.7.40: Pulling from library/mysql
d26998a7c52d: Pull complete
4a9d8a3567e3: Pull complete
bfee1f0f349e: Pull complete
71ff8dfb9b12: Pull complete
bf56cbebc916: Pull complete
2e747e5e37d7: Pull complete
711a06e512da: Pull complete
3288d68e4e9e: Pull complete
49271f2d6d15: Pull complete
f782f6cac69c: Pull complete
701dea355691: Pull complete
Digest: sha256:6306f106a056e24b3a2582a59a4c84cd199907f826eff27df36406f227cd9a7d
Status: Downloaded newer image for mysql:5.7.40
docker.io/library/mysql:5.7.40
```

Récupération image phpmyadmin
```bash=
jere@LAPTOP-ADMIN:~/cours-cloud/conteneur-cours/tp01/srvnginx$ docker pull phpmyadmin/phpmyadmin
Using default tag: latest
latest: Pulling from phpmyadmin/phpmyadmin
214ca5fb9032: Pull complete
cd813a1b2cb8: Pull complete
63cf7574573d: Pull complete
54c27146d16e: Pull complete
b546fbaf263b: Pull complete
16dd2cabbcd2: Pull complete
30a426b49280: Pull complete
c94e73d5f13e: Pull complete
2f5a3464a278: Pull complete
a4f9f723c297: Pull complete
5b04d16a8086: Pull complete
2a3d1fa22772: Pull complete
ef56affc4552: Pull complete
9b9b44731108: Pull complete
Digest: sha256:ae6dadd9cf3c158e42937788f7255fa820ea3daef0349226d8d43f32e76535e1
Status: Downloaded newer image for phpmyadmin/phpmyadmin:latest
docker.io/phpmyadmin/phpmyadmin:latest
```


* Exécuter deux conteneurs à partir des images et ajouter une table ainsi que quelques enregistrements dans la base de données à l’aide de phpmyadmin

```bash=
jere@LAPTOP-ADMIN:~/cours-cloud/conteneur-cours/tp01/srvnginx$ docker run -d --name cont-mysql mysql:5.7
Unable to find image 'mysql:5.7' locally
5.7: Pulling from library/mysql
Digest: sha256:6306f106a056e24b3a2582a59a4c84cd199907f826eff27df36406f227cd9a7d
Status: Downloaded newer image for mysql:5.7
a3d4a2aa7c70c73ff06c56ebc635dfb4d1a910510db95aa332a941b2273498b3
```
```bash=
jere@LAPTOP-ADMIN:~/cours-cloud/conteneur-cours/tp01/srvnginx$ docker run -d --name cont-phpmyadmin -p 8080:80 phpmyadmin/phpmyadmin
8758b22e0c77249984ce6ea28c846fd6c8ec61c7443746f680b4fb053fc05a37
```
# 8 - Faire la même chose que précédemment en utilisant un fichier docker-compose.yml

```bash=
version: '3'
 
services:
  db_ynov_TP01:
    image: mysql:5.7
    container_name: db_ynov_TP01
    environment:
      MYSQL_ROOT_PASSWORD: my_secret_password
      MYSQL_DATABASE: ynov
      MYSQL_USER: admin
      MYSQL_PASSWORD: J85YbRqNXqQPf
    ports:
      - "6033:3306"
    volumes:
      - dbdata_ynov_TP01:/var/lib/mysql
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: phpmy_ynov_TP01
    links:
      - db_ynov_TP01
    environment:
      PMA_HOST: db_ynov_TP01
      PMA_PORT: 3306
      PMA_ARBITRARY: 1
    restart: always
    ports:
      - 9110:80
volumes:
  dbdata_ynov_TP01:
```

* Qu’apporte le fichier docker-compose par rapport aux commandes docker run ? Pourquoi est-il intéressant ?

Le fichier docker-compose.yml, permet de pouvoir configurer et deployer rapidemment plusieurs conteneurs en même temps. On peut également editer les variables d'environnements de l'image (exemple pour phpmyadmin), les ports, les volumes etc...


* Quel moyen permet de configurer (premier utilisateur, première base de données, mot de passe root, …) facilement le conteneur mysql au lancement ?

Le moyen qui permet de configurer les premières données au lancement de mysql sont les variables d'environnement.

```bash
 environment:
      PMA_HOST: db_ynov_TP01
      PMA_PORT: 3306
      PMA_ARBITRARY: 1
```



# 9 - Observation de l’isolation réseau entre 3 conteneurs

```
version: '3'
 
services:
  web_ynov_TP01:
    image: praqma/network-multitool:latest
    container_name: web_ynov_TP01
    networks:
      - frontend

  app_ynov_TP01:
    image: praqma/network-multitool:latest
    container_name: app_ynov_TP01
    networks:
      - frontend
      - backend

  db_ynov_TP01:
    image: praqma/network-multitool:latest
    container_name: db_ynov_TP01
    networks:
      - backend
networks:
  frontend:
    driver: bridge
    name: frontend

  backend:
    driver: macvlan
    name: backend


```

* A l’aide de docker-compose et de l’image praqma/network-multitool disponible sur le Docker Hub créer 3 services (web, app et db) et 2 réseaux(frontend et backend).Les services web et db ne devront pas pouvoir effectuer de ping de l’un vers l’autre

```
Log du container db_ynov

bash-5.1# ping web_ynov_TP01
ping: web_ynov_TP01: Name does not resolve
bash-5.1# ping app_ynov_TP01
PING app_ynov_TP01 (172.30.0.3) 56(84) bytes of data.
64 bytes from app_ynov_TP01.backend (172.30.0.3): icmp_seq=1 ttl=64 time=0.063 ms
```

* Quelles lignes du résultat de la commande docker inspect justifient ce comportement ?

Le blocage provient de plusieurs lignes lorsqu'on analyse le docker inspect
Premièrement, nous n'avons aps les mêmes réseaux, donc impossible pour les machines de se ping
Et deuxièmement, le network id n'est pas renseigné pour les services web et db.

* Dans quelle situation réelles (avec quelles images) pourrait-on avoir cette configuration réseau ? Dans quel but ?
Par exemple, dans le cas ou un site internet se fait attaqué, la personne ne pourra pas accéder à la db.


