# TP01 Axel - Helm

## Installation de Helm

```bash=
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

## Déployer un nextcloud en utilisant la chart helm officielle

```bash=
helm repo add nextcloud https://nextcloud.github.io/helm/
helm install my-release nextcloud/nextcloud
```

## Créer un fichier values.yaml pour augmenter le nombre de replicas.

On va dans la doc officiel chercher la variable permettant d'augmenter le nombre de replicas : 

![](https://i.imgur.com/XNQevTW.png)

## Accés à NextCloud

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


