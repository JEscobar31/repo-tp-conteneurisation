# TP Axel - Helm

## TP01

### Installation de Helm

```bash=
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Déployer un nextcloud en utilisant la chart helm officielle

```bash=
helm repo add nextcloud https://nextcloud.github.io/helm/
helm install my-release nextcloud/nextcloud
```

### Créer un fichier values.yaml pour augmenter le nombre de replicas.

On va dans la doc officiel chercher la variable permettant d'augmenter le nombre de replicas : 

![](https://i.imgur.com/XNQevTW.png)

### Accés à NextCloud

On récupére le nom du service et son port : my-release-nextcloud && 8080
```bash=
jere@LAPTOP-ADMIN:~/cours-cloud/conteneur-cours/repo-tp-conteneurisation/02-KUBERNETES/tp01-axel$ kubectl get service
NAME                   TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes             ClusterIP   10.96.0.1       <none>        443/TCP    77m
my-release-nextcloud   ClusterIP   10.96.130.165   <none>        8080/TCP   76m
```
nom du service : my-release-nextcloud
port : 8080

```bash=
jere@LAPTOP-ADMIN:~/cours-cloud/conteneur-cours/repo-tp-conteneurisation/02-KUBERNETES/tp01-axel$ kubectl port-forward service/my-release-nextcloud 8080:8080
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80    
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
Handling connection for 8080
```

![](https://i.imgur.com/WD33mTR.png)

## TP02

Consigne : La chart devra déployer un serveur nginx.
 
● Les déploiements, services, ingress, … seront donc créés par cette chart.
L’image, tag, ports, type de service doivent être modifiables à l’aide d’un fichier values.yaml.


● 2 fichiers values-(prod / dev).yaml devront être créés.
Le fichier prod déploiera un serveur nginx en version 1.22 avec comme domaine srv-prod.test
dans le namespace production.
Le fichier dev déploiera un serveur nginx en version 1.23 avec comme domaine srv-dev.test
dans le namespace development. 

 
Fichiers :

Après avoir fait la commande pour générer l'arborescence de fichier, nosu ne sommes pas obliger de garder tous les élements, on peut faire un trie (CD fichiers ingress, services & deployments sur GITHUB, lien : https://github.com/JEscobar31/repo-tp-conteneurisation/tree/main/TP%20AXEL/tp02-mychart-nginx)

Il faut également créer les fichiers "values-dev.yaml et values-prod" comme demandé dans la consigne :

* fichier values-prod.yaml : 

```bash=
replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  # Overrides the image tag whose default is the chart appVersion.
  tag: "1.22"
  
ingress:
  enabled: true
  hosts:
    - host: srv-prod.test
      paths:
        - path: /
          pathType: ImplementationSpecific
```

* fichier values-dev.yaml : 

```bash=
replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  # Overrides the image tag whose default is the chart appVersion.
  tag: "1.23"
  
ingress:
  enabled: true
  hosts:
    - host: srv-dev.test
      paths:
        - path: /
          pathType: ImplementationSpecific

```

 
```bash
helm install -f values-prod.yaml nginx-dev ../tp02-mychart-nginx -n production --create-namespace
helm install -f values-dev.yaml nginx-dev ../tp02-mychart-nginx -n development --create-namespace
```
 
Résultat : 
 
(ATTENTION: ne pas oublier de modifier dans WSL et sur le pc Windows le fichier hosts en y ajoutant les deux domaines ^^ )
 
![](https://i.imgur.com/HO3vBf7.png)


## TP02 (SUITE)


● Sur chaque fichier values.yaml, ajoutez un bloc permettant d’insérer le contenu de votre page
html. Les pages doivent être différentes en prod et en dev.
Cette variable devra être importée dans une configmap, qui sera elle même montée dans le pod
nginx.

* Fichier values values-prod.yaml après avoir ajouter la variable d'envrionnement permettant de pouvoir insérer du code HTML :

```bash=
replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  # Overrides the image tag whose default is the chart appVersion.
  tag: "1.22"
  
ingress:
  enabled: true
  hosts:
    - host: srv-prod.test
      paths:
        - path: /
          pathType: ImplementationSpecific
      env:
          CODE_HTML: 
            <html>
              <h1>SRV PROD</h1>
            </html>
      volumes:
        - name: code-html
          configMap:
            name: contenu-html
```

* Fichier values-dev.yaml après avoir ajouter la variable d'envrionnement permettant de pouvoir insérer du code HTML :

```bash=
replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  # Overrides the image tag whose default is the chart appVersion.
  tag: "1.23"
  
ingress:
  enabled: true
  hosts:
    - host: srv-dev.test
      paths:
        - path: /
          pathType: ImplementationSpecific
      env:
          CODE_HTML: 
            <html>
              <h1>SRV DEV</h1>
            </html>
      volumes:
        - name: code-html
          configMap:
            name: contenu-html
```

* Ensuite, création du fichier configMap.yaml :

Ce fichier, permet de pouvoir récupérer la variable d'environnement "CODE_HTML" ajouter  dans les fichiers "values-prod.yaml" & "values-dev.yaml"

```bash=
apiVersion: v1
kind: ConfigMap
metadata:
  name: contenu-html
data:
  CODE_HTML: CODE_HTML
```


