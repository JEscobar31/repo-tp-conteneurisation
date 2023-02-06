# TP GUILLAUME - Install version server

## 3: Infrastructure Provisioning

### Mise en place de l'infrastructure

Avant de commencer, nous allons deployer l'infrastructure qui contient : 
* 1 control plane
* 2 nodes

Pour cela, il faut télécharger le dossier terraform que nous à préparé Guillaume : https://github.com/Arcahub/kube-install-tuto/tree/master/terraform

Attention : penser à modifier le type d'instance afin d'éviter d'avoir une erreur lors de l'étape de "terraform destroy".

Exemple : 

```bash=
variable "node_type" {
  description = "Type of nodes to create."
  type        = string
  default = "DEV1-S"  
}
```

Maintenant, que nous avons modifier les fichiers "variables.tf", on peut lancer les commandes :
* terraform init
* terraform plan
* terraform apply -var="project_name=jeremy-tp" (🗒 modifier le nom des machines pour mieux les reconnaitres)

Résultat de la commande "terraform apply -var="project_name=jeremy-tp" : 

```bash=
Apply complete! Resources: 8 added, 0 changed, 0 destroyed.

Outputs:

control_plane_ip = "10.72.62.9"
public_gateway_ip = "212.47.245.128"
worker_ips = [
  "10.69.28.21",
  "10.68.236.1",
]
```

![](https://i.imgur.com/x9djI3s.png)

### Connexion aux machines

Maintenant que les machines sont crées, on peut s'y connecter avec la commande suivante :
```
ssh -J bastion@<public gateway_ip>:61000 root@<instance_ip>
```

* control plane :
> ssh -J bastion@212.47.245.128:61000 root@10.72.62.9

```bash=
jere@LAPTOP-ADMIN:~$ sudo ssh -J bastion@212.47.245.128:61000 root@10.72.62.9
[sudo] password for jere: 
The authenticity of host '[212.47.245.128]:61000 ([212.47.245.128]:61000)' can't be established.
ECDSA key fingerprint is SHA256:zJpIqqrdc0npGLYDFetkyl0cusmBp3BlJt0Ayk1YmxU.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[212.47.245.128]:61000' (ECDSA) to the list of known hosts.
The authenticity of host '10.72.62.9 (<no hostip for proxy command>)' can't be established.
ECDSA key fingerprint is SHA256:npLcMEfTx/88za2C+94UgoPkU0M+omEyj0MVydH9G04.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.72.62.9' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 22.04.1 LTS (GNU/Linux 5.15.0-53-generic x86_64)     

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon Feb  6 07:50:42 UTC 2023

  System load:  0.0                Processes:             101
root@jeremy-tp-controlplane:~#
```
    
* node-1
> ssh -J bastion@212.47.245.128:61000 root@10.69.28.21

```bash=
jere@LAPTOP-ADMIN:~$ sudo ssh -J bastion@212.47.245.128:61000 root@10.69.28.21
[sudo] password for jere: 
The authenticity of host '10.69.28.21 (<no hostip for proxy command>)' can't be established.
ECDSA key fingerprint is SHA256:ZrWy0Kf4rdTjFzBpMfIl6a2x2Ee0plst8iRPmsgj3FI.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.69.28.21' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 22.04.1 LTS (GNU/Linux 5.15.0-53-generic x86_64)     

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon Feb  6 07:51:35 UTC 2023

  System load:  0.0                Processes:             102
  Usage of /:   10.1% of 17.87GB   Users logged in:       0
  Memory usage: 10%                IPv4 address for ens2: 10.69.28.21
  Swap usage:   0%                 IPv4 address for ens5: 192.168.1.100

3 updates can be applied immediately.
3 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update


The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

root@jeremy-tp-node-1:~#
```
    
* node-2
> ssh -J bastion@212.47.245.128:61000 root@10.68.236.1

```bash=
jere@LAPTOP-ADMIN:~$ sudo ssh -J bastion@212.47.245.128:61000 root@10.68.236.1
[sudo] password for jere: 
The authenticity of host '10.68.236.1 (<no hostip for proxy command>)' can't be established.
ECDSA key fingerprint is SHA256:VKRf6EeTVQ5XJca7g4Gx6CpjTu/j0vYou/uNkQazBnM.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.68.236.1' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 22.04.1 LTS (GNU/Linux 5.15.0-53-generic x86_64)     

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon Feb  6 07:52:26 UTC 2023

  System load:  0.0                Processes:             99
  Usage of /:   10.1% of 17.87GB   Users logged in:       0
  Memory usage: 10%                IPv4 address for ens2: 10.68.236.1  
  Swap usage:   0%                 IPv4 address for ens5: 192.168.1.101

3 updates can be applied immediately.
3 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update


The programs included with the Ubuntu system are free software;        
the exact distribution terms for each program are described in the     
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by   
applicable law.

root@jeremy-tp-node-2:~# 
```

## 4. Kubernetes installation with kubeadm


Les étapes suivantes doivent être exécutées sur tous les nœuds du cluster. On doit donc suivre dans un premire les étapes suivantes sur le control plane puis les répéter sur les 2 noeuds.

Pour se faciliter la tâches, on peux créer un script en local sur chaque machine pour éxecuter chaque commande automatiquement :

script-etape1.sh
```bash=
# enabling the required kernel network modules
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system




# Install required packages for https repository
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl
# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
# Add Docker repository
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
# Update package manager index
sudo apt-get update



sudo apt-get install -y containerd.io
```

Output script1.sh:

```bash=
root@jeremy-tp-controlplane:~# cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
> overlay
> br_netfilter
> EOF
e overlay
sudo modprobe br_netfilter

# sysctl params reoverlay
br_netfilter
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~# sudo modprobe overlay
quired by setup, params persist sudo modprobe br_netfilter      

# sysctl params required by setup, params persist across reboots
catroot@jeremy-tp-controlplane:~#  <<EOF | sudo tee /etc/sysctl.d/k8s.conf
> net.bridge.bridge-nf-call-iptables  = 1
> net.bridge.bridge-nf-call-ip6tables = 1
> net.ipv4.ip_forward                 = 1
> EOF
root@jeremy-tp-controlplane:~# sudo sysctl --system
* Applying /etc/sysctl.d/10-console-messages.conf ...
kernel.printk = 4 4 1 7
* Applying /etc/sysctl.d/10-ipv6-privacy.conf ...    
net.ipv6.conf.all.use_tempaddr = 2
net.ipv6.conf.default.use_tempaddr = 2
* Applying /etc/sysctl.d/10-kernel-hardening.conf ...
kernel.kptr_restrict = 1
* Applying /etc/sysctl.d/10-magic-sysrq.conf ...     
kernel.sysrq = 176
* Applying /etc/sysctl.d/10-network-security.conf ...
net.ipv4.conf.default.rp_filter = 2
net.ipv4.conf.all.rp_filter = 2
* Applying /etc/sysctl.d/10-ptrace.conf ...
kernel.yama.ptrace_scope = 1
* Applying /etc/sysctl.d/10-zeropage.conf ...        
vm.mmap_min_addr = 65536
* Applying /usr/lib/sysctl.d/50-default.conf ...     
kernel.core_uses_pid = 1
net.ipv4.conf.default.rp_filter = 2
net.ipv4.conf.default.accept_source_route = 0
sysctl: setting key "net.ipv4.conf.all.accept_source_route": Invalid argument
net.ipv4.conf.default.promote_secondaries = 1
sysctl: setting key "net.ipv4.conf.all.promote_secondaries": Invalid argument
net.ipv4.ping_group_range = 0 2147483647
net.core.default_qdisc = fq_codel
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
fs.protected_regular = 1
fs.protected_fifos = 1
* Applying /usr/lib/sysctl.d/50-pid-max.conf ...
kernel.pid_max = 4194304
* Applying /etc/sysctl.d/99-cloudimg-ipv6.conf ...
net.ipv6.conf.all.use_tempaddr = 0
net.ipv6.conf.default.use_tempaddr = 0
* Applying /usr/lib/sysctl.d/99-protect-links.conf ...
fs.protected_fifos = 1
fs.protected_hardlinks = 1
fs.protected_regular = 2
fs.protected_symlinks = 1
* Applying /etc/sysctl.d/99-scaleway.conf ...
vm.min_free_kbytes = 65536
* Applying /etc/sysctl.d/99-sysctl.conf ...
* Applying /etc/sysctl.d/k8s.conf ...
* Applying /etc/sysctl.conf ...
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~# sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl
Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [114 kB]
Get:3 http://archive.ubuntu.com/ubuntu jammy-backports InRelease [107 kB]
Get:4 http://archive.ubuntu.com/ubuntu jammy-updates/main amd64 Packages [852 kB]
Get:5 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]
Hit:6 https://ppa.launchpadcontent.net/scaleway/stable/ubuntu jammy InRelease
Get:7 http://security.ubuntu.com/ubuntu jammy-security/main amd64 Packages [601 kB]
Get:8 http://security.ubuntu.com/ubuntu jammy-security/main Translation-en [127 kB]
Get:9 http://security.ubuntu.com/ubuntu jammy-security/main amd64 c-n-f Metadata [8064 B]
Get:10 http://security.ubuntu.com/ubuntu jammy-security/restricted amd64 Packages [528 kB]
Get:11 http://security.ubuntu.com/ubuntu jammy-security/restricted Translation-en [81.2 kB]
Get:12 http://security.ubuntu.com/ubuntu jammy-security/restricted amd64 c-n-f Metadata [556 B]
Get:13 http://security.ubuntu.com/ubuntu jammy-security/universe amd64 Packages [637 kB]
Get:14 http://archive.ubuntu.com/ubuntu jammy-updates/main Translation-en [189 kB]
Get:15 http://security.ubuntu.com/ubuntu jammy-security/universe Translation-en [87.5 kB]
Get:16 http://security.ubuntu.com/ubuntu jammy-security/universe amd64 c-n-f Metadata [11.3 kB]
Get:17 http://security.ubuntu.com/ubuntu jammy-security/multiverse amd64 Packages [4268 B]
Get:18 http://security.ubuntu.com/ubuntu jammy-security/multiverse Translation-en [972 B]
Get:19 http://security.ubuntu.com/ubuntu jammy-security/multiverse amd64 c-n-f Metadata [228 B]
Get:20 http://archive.ubuntu.com/ubuntu jammy-updates/main amd64 c-n-f Metadata [13.2 kB]
Get:21 http://archive.ubuntu.com/ubuntu jammy-updates/restricted amd64 Packages [566 kB]
Get:22 http://archive.ubuntu.com/ubuntu jammy-updates/restricted Translation-en [87.1 kB]
Get:23 http://archive.ubuntu.com/ubuntu jammy-updates/restricted amd64 c-n-f Metadata [556 B]
Get:24 http://archive.ubuntu.com/ubuntu jammy-updates/universe amd64 Packages [797 kB]
Get:25 http://archive.ubuntu.com/ubuntu jammy-updates/universe Translation-en [142 kB]
Get:26 http://archive.ubuntu.com/ubuntu jammy-updates/universe amd64 c-n-f Metadata [15.1 kB]
Get:27 http://archive.ubuntu.com/ubuntu jammy-updates/multiverse amd64 Packages [7988 B]
Get:28 http://archive.ubuntu.com/ubuntu jammy-updates/multiverse Translation-en [2448 B]
Get:29 http://archive.ubuntu.com/ubuntu jammy-updates/multiverse amd64 c-n-f Metadata [432 B]
Get:30 http://archive.ubuntu.com/ubuntu jammy-backports/main amd64 Packages [40.7 kB]
Get:31 http://archive.ubuntu.com/ubuntu jammy-backports/main Translation-en [9800 B]
Get:32 http://archive.ubuntu.com/ubuntu jammy-backports/main amd64 c-n-f Metadata [392 B]
Get:33 http://archive.ubuntu.com/ubuntu jammy-backports/universe amd64 Packages [19.5 kB]
Get:34 http://archive.ubuntu.com/ubuntu jammy-backports/universe Translation-en [13.8 kB]
Get:35 http://archive.ubuntu.com/ubuntu jammy-backports/universe amd64 c-n-f Metadata [392 B]
Fetched 5175 kB in 31s (169 kB/s)
Reading package lists... Done
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
  libcurl4
The following NEW packages will be installed:
  apt-transport-https
The following packages will be upgraded:
  ca-certificates curl libcurl4
3 upgraded, 1 newly installed, 0 to remove and 87 not upgraded.
Need to get 629 kB of archives.
After this operation, 161 kB of additional disk space will be used.
Get:1 http://archive.ubuntu.com/ubuntu jammy-updates/main amd64 ca-certificates all 20211016ubuntu0.22.04.1 [144 kB]
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates/universe amd64 apt-transport-https all 2.4.8 [1506 B]
Get:3 http://archive.ubuntu.com/ubuntu jammy-updates/main amd64 curl amd64 7.81.0-1ubuntu1.7 [193 kB]
Get:4 http://archive.ubuntu.com/ubuntu jammy-updates/main amd64 libcurl4 amd64 7.81.0-1ubuntu1.7 [289 kB]
Fetched 629 kB in 2s (269 kB/s)
Preconfiguring packages ...
(Reading database ... 71501 files and directories currently installed.)
Preparing to unpack .../ca-certificates_20211016ubuntu0.22.04.1_all.deb ...
Unpacking ca-certificates (20211016ubuntu0.22.04.1) over (20211016) ...
Selecting previously unselected package apt-transport-https.
Preparing to unpack .../apt-transport-https_2.4.8_all.deb ...
Unpacking apt-transport-https (2.4.8) ...
Preparing to unpack .../curl_7.81.0-1ubuntu1.7_amd64.deb ...
Unpacking curl (7.81.0-1ubuntu1.7) over (7.81.0-1ubuntu1.6) ...
Preparing to unpack .../libcurl4_7.81.0-1ubuntu1.7_amd64.deb ...
Unpacking libcurl4:amd64 (7.81.0-1ubuntu1.7) over (7.81.0-1ubuntu1.6) ...
Setting up apt-transport-https (2.4.8) ...
Setting up ca-certificates (20211016ubuntu0.22.04.1) ...
Updating certificates in /etc/ssl/certs...
rehash: warning: skipping ca-certificates.crt,it does not contain exactly one certificate or CRL
0 added, 3 removed; done.
Setting up libcurl4:amd64 (7.81.0-1ubuntu1.7) ...
Setting up curl (7.81.0-1ubuntu1.7) ...
Processing triggers for man-db (2.10.2-1) ...
Processing triggers for libc-bin (2.35-0ubuntu3.1) ...
Processing triggers for ca-certificates (20211016ubuntu0.22.04.1) ...
Updating certificates in /etc/ssl/certs...
0 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d...
done.
Scanning processes...
Scanning linux images...

Running kernel seems to be up-to-date.

No services need to be restarted.

No containers need to be restarted.

No user sessions are running outdated binaries.

No VM guests are running outdated hypervisor (qemu) binaries on this host.
root@jeremy-tp-controlplane:~# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
Warning: apt-key is deprecated. Manage keyring files in trusted.gpg.d instead (see apt-key(8)).
OK
root@jeremy-tp-controlplane:~# sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) 
stable"
Repository: 'deb [arch=amd64] https://download.docker.com/linux/ubuntu jammy stable'
Description:
Archive for codename: jammy components: stable
More info: https://download.docker.com/linux/ubuntu
Adding repository.
Press [ENTER] to continue or Ctrl-c to cancel.
Adding deb entry to /etc/apt/sources.list.d/archive_uri-https_download_docker_com_linux_ubuntu-jammy.list
Adding disabled deb-src entry to /etc/apt/sources.list.d/archive_uri-https_download_docker_com_linux_ubuntu-jammy.list
Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Hit:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease
Hit:3 http://archive.ubuntu.com/ubuntu jammy-backports InRelease
Hit:4 http://security.ubuntu.com/ubuntu jammy-security InRelease
Get:5 https://download.docker.com/linux/ubuntu jammy InRelease [48.9 kB]
Hit:6 https://ppa.launchpadcontent.net/scaleway/stable/ubuntu jammy InRelease
Get:7 https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages [12.7 kB]
Fetched 61.6 kB in 10s (5947 B/s)
Reading package lists... Done
W: https://download.docker.com/linux/ubuntu/dists/jammy/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
root@jeremy-tp-controlplane:~# 
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~# sudo apt-get update
Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Hit:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease
Hit:3 http://archive.ubuntu.com/ubuntu jammy-backports InRelease
Hit:4 http://security.ubuntu.com/ubuntu jammy-security InRelease
Hit:5 https://ppa.launchpadcontent.net/scaleway/stable/ubuntu jammy InRelease
Hit:6 https://download.docker.com/linux/ubuntu jammy InRelease
Reading package lists... Done
W: https://download.docker.com/linux/ubuntu/dists/jammy/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~# sudo apt-get install -y containerd.io
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  containerd.io
0 upgraded, 1 newly installed, 0 to remove and 87 not upgraded.
Need to get 27.7 MB of archives.
After this operation, 114 MB of additional disk space will be used.
Get:1 https://download.docker.com/linux/ubuntu jammy/stable amd64 containerd.io amd64 1.6.16-1 [27.7 MB]
Fetched 27.7 MB in 5s (5308 kB/s)      
Selecting previously unselected package containerd.io.
(Reading database ... 71502 files and directories currently installed.)
Preparing to unpack .../containerd.io_1.6.16-1_amd64.deb ...
Unpacking containerd.io (1.6.16-1) ...
Setting up containerd.io (1.6.16-1) ...
Created symlink /etc/systemd/system/multi-user.target.wants/containerd.service → /lib/systemd/system/containerd.service.
Processing triggers for man-db (2.10.2-1) ...
Scanning processes...
Scanning linux images...

Running kernel seems to be up-to-date.

No services need to be restarted.

No containers need to be restarted.

No user sessions are running outdated binaries.

No VM guests are running outdated hypervisor (qemu) binaries on this host.
root@jeremy-tp-controlplane:~#
root@jeremy-tp-controlplane:~# sudo mkdir -p /etc/containerd
root@jeremy-tp-controlplane:~# sudo containerd config default > /etc/containerd/config.toml
```

Dans mon cas, j'ai diviser le script en 2 car il faut aller modifier un fichier:

> Find the section [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options] in the /etc/containerd/config.toml file and change the SystemdCgroup value to true

```bash
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
            BinaryName = ""
            CriuImagePath = ""
            CriuPath = ""
            CriuWorkPath = ""
            IoGid = 0
            IoUid = 0
            NoNewKeyring = false
            NoPivotRoot = false
            Root = ""
            ShimCgroup = ""
            SystemdCgroup = true
```
Après avoir modifier le fichier, il faut restart le service "containerd" :

> sudo systemctl restart containerd

On peut maintenant, créer un fichier script2.sh avec les commandes suivantes :

script2.sh
```bash=
ctr images pull docker.io/library/hello-world:latest
sudo ctr run --rm docker.io/library/hello-world:latest hello-world
ctr images rm docker.io/library/hello-world:latest


# Install required packages for https repository
sudo apt-get update && sudo apt-get install -y apt-transport-https curl
# Add Kubernetes’s official GPG key
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
# Add Kubernetes repository
cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
# Update package manager index
sudo apt-get update
# Install kubeadm, kubelet and kubectl with the exact same version or else components could be incompatible
sudo apt-get install -y kubelet=1.25.0-00 kubeadm=1.25.0-00 kubectl=1.25.0-00
# Hold the version of the packages
sudo apt-mark hold kubelet kubeadm kubectl


sudo apt-get upgrade
```

Output script2.sh : 

```bash=



```

Après avoir executer les 2 scripts et modifier le fichier, il fait réitérer les étapes sur les 2 nodes.

## 4.1. Setting up control plane node

### Initialisation du control plane avec kubeadm


```bash=
sudo kubeadm init
```

Output :

```bash=
root@jeremy-tp-controlplane:~# sudo kubeadm init
I0206 12:50:52.346705   19258 version.go:256] remote version is much newer: v1.26.1; falling back to: stable-1.25
[init] Using Kubernetes version: v1.25.6
[preflight] Running pre-flight checks   
        [WARNING SystemVerification]: missing optional cgroups: blkio
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'  
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [jeremy-tp-controlplane kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.1.50]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [jeremy-tp-controlplane localhost] and IPs [192.168.1.50 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [jeremy-tp-controlplane localhost] and IPs [192.168.1.50 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 16.514348 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node jeremy-tp-controlplane as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node jeremy-tp-controlplane as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]
[bootstrap-token] Using token: um7j46.0h8wq5g37540wqxk
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.1.50:6443 --token um7j46.0h8wq5g37540wqxk \
        --discovery-token-ca-cert-hash sha256:f9b5ee2333bd522285187757dff01291dcfa6d0a72b375f085f362fc4a956102
```

### Setup de kubeconfig

```bash=
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Output : 

```bash=
root@jeremy-tp-controlplane:~# mkdir -p $HOME/.kube
root@jeremy-tp-controlplane:~# sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
root@jeremy-tp-controlplane:~# sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### Vérification control plane up

> kubectl get nodes

Output :

```Bash=
root@jeremy-tp-controlplane:~# kubectl get nodes
NAME                     STATUS     ROLES           AGE     VERSION
jeremy-tp-controlplane   NotReady   control-plane   2m19s   v1.25.0
```

### Installation de CNI plugin


> kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml

Output : 

```bash=
root@jeremy-tp-controlplane:~# kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml
serviceaccount/weave-net created
clusterrole.rbac.authorization.k8s.io/weave-net created       
clusterrolebinding.rbac.authorization.k8s.io/weave-net created
role.rbac.authorization.k8s.io/weave-net created
rolebinding.rbac.authorization.k8s.io/weave-net created
daemonset.apps/weave-net created
```

Attendre que les pods soit prêts

```bash=
kubectl -n kube-system wait pod -l name=weave-net --for=condition=Ready --timeout=-1s
kubectl get pods -l name=weave-net -n kube-system
```

Output : 

```bash=
root@jeremy-tp-controlplane:~# kubectl -n kube-system wait pod -l name=weave-net --for=condition=Ready --timeout=-1s
pod/weave-net-mwn9q condition met
root@jeremy-tp-controlplane:~# kubectl get pods -l name=weave-net -n kube-system
NAME              READY   STATUS    RESTARTS      AGE
weave-net-mwn9q   2/2     Running   1 (45s ago)   56s
```

### Vérification control plane up

> kubectl get nodes

Output :

```Bash=
NAME                     STATUS   ROLES           AGE     VERSION
jeremy-tp-controlplane   Ready    control-plane   4m38s   v1.25.0
```

On peut également vérifier que le "coredns" soit up :

> kubectl get pods --all-namespaces

Output :

```Bash=

```

## 4.2. Setting up worker node

Maintenant que le control plane à été configuré, nous allons setup les 2 nodes.

Pour cela, il faut commencer par crééer un token sur le controlplane et copier le résultat de la commande sur les 2 nodes :

* control plane
> kubeadm token create --print-join-command

Output : 

```bash=
root@jeremy-tp-controlplane:~# kubeadm token create --print-join-command
kubeadm join 192.168.1.50:6443 --token r415pf.4lbpqk7rrzp7v2pn --discovery-token-ca-cert-hash sha256:f9b5ee2333bd522285187757dff01291dcfa6d0a72b375f085f362fc4a956102 
```

* node-1
> kubeadm join 192.168.1.50:6443 --token r415pf.4lbpqk7rrzp7v2pn --discovery-token-ca-cert-hash sha256:f9b5ee2333bd522285187757dff01291dcfa6d0a72b375f085f362fc4a956102

Output : 

```bash=
root@jeremy-tp-node-1:~# kubeadm join 192.168.1.50:6443 --token r415pf.4lbpqk7rrzp7v2pn --discovery-token-ca-cert-hash sha256:f9b5ee2333bd522285187757dff01291dcfa6d0a72b375f085f362fc4a956102
[preflight] Running pre-flight checks
        [WARNING SystemVerification]: missing optional cgroups: blkio
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

* node-2
> kubeadm join 192.168.1.50:6443 --token r415pf.4lbpqk7rrzp7v2pn --discovery-token-ca-cert-hash sha256:f9b5ee2333bd522285187757dff01291dcfa6d0a72b375f085f362fc4a956102

Output : 

```bash=
root@jeremy-tp-node-2:~# kubeadm join 192.168.1.50:6443 --token r415pf.4lbpqk7rrzp7v2pn --discovery-token-ca-cert-hash sha256:f9b5ee2333bd522285187757dff01291dcfa6d0a72b375f085f362fc4a956102
[preflight] Running pre-flight checks
        [WARNING SystemVerification]: missing optional cgroups: blkio
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

### Vérification worker node is up

Afin de vérifier que les deux worker soit bien connecter au node du control plane, on peut éxecuter la commande suivante sur le control plane :

> kubectl get nodes

Output :

```Bash=
root@jeremy-tp-controlplane:~# kubectl get nodes
NAME                     STATUS   ROLES           AGE     VERSION
jeremy-tp-controlplane   Ready    control-plane   8m49s   v1.25.0
jeremy-tp-node-1         Ready    <none>          66s     v1.25.0
jeremy-tp-node-2         Ready    <none>          60s     v1.25.0
```

De plus, il est possible de modifer le nom de roles des deux nodes en executant les commandes suivantes :

> kubectl label node node-1 node-role.kubernetes.io/worker=worker

> kubectl label node node-2node-role.kubernetes.io/worker=worker

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl label node jeremy-tp-node-1 node-role.kubernetes.io/worker=worker
node/jeremy-tp-node-1 labeled
root@jeremy-tp-controlplane:~# kubectl label node jeremy-tp-node-2 node-role.kubernetes.io/worker=worker
node/jeremy-tp-node-2 labeled
root@jeremy-tp-controlplane:~# 
```


## 5. Understanding what we have done

On peut vérifier que les worker soit bien présent en executant la commande suivante :

> kubectl get nodes

Output :

```Bash=
root@jeremy-tp-controlplane:~# kubectl get nodes
NAME                     STATUS   ROLES           AGE     VERSION
jeremy-tp-controlplane   Ready    control-plane   10m     v1.25.0
jeremy-tp-node-1         Ready    worker          2m19s   v1.25.0
jeremy-tp-node-2         Ready    worker          2m13s   v1.25.0
```

## 5.1 Static pods

### What are static pods ?

Run the following command to see the content of the static pod directory :

> sudo ls /etc/kubernetes/manifests

Output : 

```bash=
root@jeremy-tp-controlplane:~# sudo ls /etc/kubernetes/manifests
etcd.yaml  kube-apiserver.yaml  kube-controller-manager.yaml  kube-scheduler.yaml
```

You can check that these files match the pods that are running in the kube-system namespace :

> kubectl get pods --namespace=kube-system

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl get pods --namespace=kube-system
NAME                                             READY   STATUS    RESTARTS       AGE
coredns-565d847f94-9t86r                         1/1     Running   0              12m
coredns-565d847f94-dvjsc                         1/1     Running   0              12m
etcd-jeremy-tp-controlplane                      1/1     Running   0              12m
kube-apiserver-jeremy-tp-controlplane            1/1     Running   0              12m  
kube-controller-manager-jeremy-tp-controlplane   1/1     Running   0              12m  
kube-proxy-25dfl                                 1/1     Running   0              12m  
kube-proxy-68fm9                                 1/1     Running   0              4m33s
kube-proxy-c22n6                                 1/1     Running   0              4m39s
kube-scheduler-jeremy-tp-controlplane            1/1     Running   0              12m  
weave-net-mwn9q                                  2/2     Running   1 (9m4s ago)   9m15s
weave-net-rfkm8                                  2/2     Running   0              4m33s
weave-net-vw2lm                                  2/2     Running   0              4m39s
```

### Playing with static pods

Let's try to destroy the kube-apiserver pod only with kubectl. To do that you will need to identify the name of the pod:

> kubectl delete pod kube-apiserver-jeremy-tp-controlplane  --namespace=kube-system
    
Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl delete pod kube-apiserver-jeremy-tp-controlplane  --namespace=kube-system
pod "kube-apiserver-jeremy-tp-controlplane" deleted
```

But if you check the pods again, you will see that the kube-apiserver pod is still running :

> kubectl get pods --namespace=kube-system

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl get pods --namespace=kube-system
NAME                                             READY   STATUS    RESTARTS      AGE  
coredns-565d847f94-9t86r                         1/1     Running   0             15m  
coredns-565d847f94-dvjsc                         1/1     Running   0             15m  
etcd-jeremy-tp-controlplane                      1/1     Running   0             16m  
kube-apiserver-jeremy-tp-controlplane            1/1     Running   0             57s  
```

Let's try to delete the kube-apiserver pod file :

We only move the file to another location to be able to restore it later, what's important is that the file is deleted from the static pod directory :

> sudo mv /etc/kubernetes/manifests/kube-apiserver.yaml ~/kube-apiserver.yaml

Output :

```bash=
root@jeremy-tp-controlplane:~# sudo mv /etc/kubernetes/manifests/kube-apiserver.yaml ~/kube-apiserver.yaml
```

Now the kube-apiserver is gone and how can we test that ? Try to run any kubectl command and you will endup with an error since kubectl can't contact the API server.

> kubectl get pods --namespace=kube-system

Output :

```bash=
root@jeremy-tp-controlplane:~# sudo kubectl get pods --namespace=kube-system
The connection to the server 192.168.1.50:6443 was refused - did you specify the right host or port?
```

Let's restore the file :

> sudo mv ~/kube-apiserver.yaml /etc/kubernetes/manifests/kube-apiserver.yaml

Output :

```bash=
root@jeremy-tp-controlplane:~# sudo mv ~/kube-apiserver.yaml /etc/kubernetes/manifests/kube-apiserver.yaml
root@jeremy-tp-controlplane:~# sudo kubectl get pods --namespace=kube-system
NAME                                             READY   STATUS    RESTARTS      AGE  
coredns-565d847f94-9t86r                         1/1     Running   0             18m  
coredns-565d847f94-dvjsc                         1/1     Running   0             18m  
etcd-jeremy-tp-controlplane                      1/1     Running   0             18m  
kube-apiserver-jeremy-tp-controlplane            1/1     Running   0             3m16s
```

We can also create a new pod file in the static pod directory :

```
sudo tee /etc/kubernetes/manifests/nginx.yaml <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: nginx-test
  namespace: default
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
EOF
```

Output :

```bash=
root@jeremy-tp-controlplane:~# sudo tee /etc/kubernetes/manifests/nginx.yaml <<EOF
> apiVersion: v1
> kind: Pod
> metadata:
>   name: nginx-test  
>   namespace: default
> spec:
>   containers:
>   - name: nginx        
>     image: nginx       
>     ports:
>     - containerPort: 80
> EOF
apiVersion: v1
kind: Pod     
metadata:     
  name: nginx-test
  namespace: default
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
```

And now, the nginx pod is running :

> kubectl get pods --namespace=default

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl get pods --namespace=default
NAME                                READY   STATUS    RESTARTS   AGE
nginx-test-jeremy-tp-controlplane   1/1     Running   0          35s
```

Let's clean up :

> sudo rm /etc/kubernetes/manifests/nginx.yaml

```bash=
root@jeremy-tp-controlplane:~# sudo rm /etc/kubernetes/manifests/nginx.yaml
```


## 5.2 Certificates

### Certificate management with kubeadm

You can check the expiration date of the certificates using the following command:

> kubeadm certs check-expiration

```bash=
root@jeremy-tp-controlplane:~# kubeadm certs check-expiration
[check-expiration] Reading configuration from the cluster...
[check-expiration] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'

CERTIFICATE                EXPIRES                  RESIDUAL TIME   CERTIFICATE AUTHORITY   EXTERNALLY MANAGED
admin.conf                 Feb 06, 2024 12:51 UTC   364d            ca                      no
apiserver                  Feb 06, 2024 12:51 UTC   364d            ca                      no      
apiserver-etcd-client      Feb 06, 2024 12:51 UTC   364d            etcd-ca                 no      
apiserver-kubelet-client   Feb 06, 2024 12:51 UTC   364d            ca                      no      
controller-manager.conf    Feb 06, 2024 12:51 UTC   364d            ca                      no
etcd-healthcheck-client    Feb 06, 2024 12:51 UTC   364d            etcd-ca                 no
etcd-peer                  Feb 06, 2024 12:51 UTC   364d            etcd-ca                 no
etcd-server                Feb 06, 2024 12:51 UTC   364d            etcd-ca                 no
front-proxy-client         Feb 06, 2024 12:51 UTC   364d            front-proxy-ca          no
scheduler.conf             Feb 06, 2024 12:51 UTC   364d            ca                      no

CERTIFICATE AUTHORITY   EXPIRES                  RESIDUAL TIME   EXTERNALLY MANAGED
ca                      Feb 03, 2033 12:51 UTC   9y              no
etcd-ca                 Feb 03, 2033 12:51 UTC   9y              no
front-proxy-ca          Feb 03, 2033 12:51 UTC   9y              no
```

You can renew all the certificates using the following command:

> kubeadm certs renew all

Output : 

```bash=
root@jeremy-tp-controlplane:~# kubeadm certs renew all
[renew] Reading configuration from the cluster...
[renew] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'

certificate embedded in the kubeconfig file for the admin to use and for kubeadm itself renewed
certificate for serving the Kubernetes API renewed
certificate the apiserver uses to access etcd renewed
certificate for the API server to connect to kubelet renewed
certificate embedded in the kubeconfig file for the controller manager to use renewed
certificate for liveness probes to healthcheck etcd renewed
certificate for etcd nodes to communicate with each other renewed
certificate for serving etcd renewed
certificate for the front proxy client renewed
certificate embedded in the kubeconfig file for the scheduler manager to use renewed

Done renewing certificates. You must restart the kube-apiserver, kube-controller-manager, kube-scheduler and etcd, so that they can use the new certificates.
```


## 7 Playing with the scheduler

### Manual scheduling

We can manually schedule a pod by setting the nodeName field in the pod spec. But first to be sure that the scheduler won't do anythinh for us, we will remove the scheduler from the cluster:

> sudo mv /etc/kubernetes/manifests/kube-scheduler.yaml /tmp

Output :

```bash=
root@jeremy-tp-controlplane:~# sudo mv /etc/kubernetes/manifests/kube-scheduler.yaml /tmp
```

You can check that the scheduler is not running anymore:

> kubectl get pods -n kube-system

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl get pods -n kube-system
NAME                                             READY   STATUS    RESTARTS      AGE
coredns-565d847f94-9t86r                         1/1     Running   0             27m
coredns-565d847f94-dvjsc                         1/1     Running   0             27m
etcd-jeremy-tp-controlplane                      1/1     Running   0             27m
kube-apiserver-jeremy-tp-controlplane            1/1     Running   0             12m
kube-controller-manager-jeremy-tp-controlplane   1/1     Running   1 (10m ago)   27m
kube-proxy-25dfl                                 1/1     Running   0             27m
kube-proxy-68fm9                                 1/1     Running   0             19m
kube-proxy-c22n6                                 1/1     Running   0             19m
weave-net-mwn9q                                  2/2     Running   1 (24m ago)   24m
weave-net-rfkm8                                  2/2     Running   0             19m
weave-net-vw2lm                                  2/2     Running   0             19m
```

Now let's try to create a pod, we will first create the manifest to be able to modify it later:

> kubectl run nginx --image=nginx --dry-run=client -o yaml > ~/nginx.yaml

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl run nginx --image=nginx --dry-run=client -o yaml > ~/nginx.yaml
```

And then create it:

> kubectl apply -f ~/nginx.yaml

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl apply -f ~/nginx.yaml
pod/nginx created
```

The pod is created but is stuck in Pending state:

> kubectl get pods

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   0/1     Pending   0          28s
```

Let's restore the scheduler:

> sudo mv /tmp/kube-scheduler.yaml /etc/kubernetes/manifests

Output :

```bash=
root@jeremy-tp-controlplane:~# sudo mv /tmp/kube-scheduler.yaml /etc/kubernetes/manifests
```

Cleanup:

> kubectl delete pod nginx

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl delete pod nginx
pod "nginx" deleted
```





### Node selector

Now let's create a pod with a node selector:

```
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeSelector:
    node-type: worker
EOF
```

Output :

```bash=
root@jeremy-tp-controlplane:~# cat <<EOF | kubectl apply -f -
> apiVersion: v1
> kind: Pod
> metadata:
>   name: nginx
> spec:
>   containers:
>   - name: nginx      
>     image: nginx     
>   nodeSelector:      
>     node-type: worker
> EOF
pod/nginx created
root@jeremy-tp-controlplane:~# 
```

The pod is successfully created and running:

> kubectl get pods -o wide

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl get pods -o wide
NAME    READY   STATUS    RESTARTS   AGE   IP          NODE               NOMINATED NODE   READINESS GATES
nginx   1/1     Running   0          29s   10.44.0.1   jeremy-tp-node-1   <none>           <none>
```

Cleanup:

> kubectl delete pod nginx

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl delete pod nginx
pod "nginx" deleted
```

### Taints and tolerations


Let's see how it works. By default we can't schedule a pod on the control plane node, that's because the control plane node has a taint:

> kubectl describe node <control-plane-node-name> | grep Taints
    
Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl describe node jeremy-tp-controlplane | grep Taints
Taints:             node-role.kubernetes.io/control-plane:NoSchedule
```
    
Let's try to create a pod that won't run on worker nodes but only on the control plane node:

```
cat<<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
    containers:
    - name: nginx
      image: nginx
    tolerations:
    - key: node-role.kubernetes.io/master
      operator: Equal
      value: ""
    - key: node-role.kubernetes.io/control-plane
      operator: Equal
      value: ""
    nodeSelector:
      node-role.kubernetes.io/control-plane: ""
EOF
```
    
Output :

```bash=
root@jeremy-tp-controlplane:~# cat<<EOF | kubectl apply -f -
> apiVersion: v1
> kind: Pod
> metadata:
>   name: nginx
> spec:
>     containers:   
>     - name: nginx 
>       image: nginx
>     tolerations:
>     - key: node-role.kubernetes.io/master
>       operator: Equal
>       value: ""
>     - key: node-role.kubernetes.io/control-plane
>       operator: Equal
>       value: ""
>     nodeSelector:
>       node-role.kubernetes.io/control-plane: ""
> EOF
pod/nginx created
```
    
The pod is successfully created and running:

> kubectl get pods
    
Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          32s
```
    
Cleanup:

> kubectl delete pod nginx
    
Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl delete pod nginx
pod "nginx" deleted
```
    
If we try to run the pod on the control plane node without the toleration, the pod will be stuck in Pending state:

```
cat<<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
    containers:
    - name: nginx
      image: nginx
    nodeSelector:
      node-role.kubernetes.io/control-plane: ""
EOF
```

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          32s
root@jeremy-tp-controlplane:~# kubectl delete pod nginx
pod "nginx" deleted
root@jeremy-tp-controlplane:~# cat<<EOF | kubectl apply -f -
> apiVersion: v1
> kind: Pod
> metadata:
>   name: nginx
> spec:
>     containers:
>     - name: nginx
>       image: nginx
>     nodeSelector:
>       node-role.kubernetes.io/control-plane: ""
> EOF
pod/nginx created
```
    
> kubectl get pods

Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   0/1     Pending   0          34s
```
    
Cleanup:

> kubectl delete pod nginx
    
Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl delete pod nginx
pod "nginx" deleted
```


## Upgrading cluster version

### Upgrade control plane
    
Nous allons d'abord se mettre à niveau kubeadm.

```
sudo apt-mark unhold kubeadm && \
sudo apt update && apt install -y kubeadm=1.26.0-00 && \
sudo apt-mark hold kubeadm
```
    
Output :

```bash=
root@jeremy-tp-controlplane:~# sudo apt-mark unhold kubeadm && \
> sudo apt update && apt install -y kubeadm=1.26.0-00 && \      
> sudo apt-mark hold kubeadm
Canceled hold on kubeadm.
Hit:1 https://download.docker.com/linux/ubuntu jammy InRelease
Hit:2 https://ppa.launchpadcontent.net/scaleway/stable/ubuntu jammy InRelease
Get:4 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]
Hit:5 http://archive.ubuntu.com/ubuntu jammy InRelease   
Get:6 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [114 kB]
Get:7 http://archive.ubuntu.com/ubuntu jammy-backports InRelease [107 kB]
Hit:3 https://packages.cloud.google.com/apt kubernetes-xenial InRelease
Fetched 331 kB in 21s (16.0 kB/s)
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
13 packages can be upgraded. Run 'apt list --upgradable' to see them.
W: https://download.docker.com/linux/ubuntu/dists/jammy/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
W: https://apt.kubernetes.io/dists/kubernetes-xenial/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details. 
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following packages will be upgraded:
  kubeadm
1 upgraded, 0 newly installed, 0 to remove and 12 not upgraded.
Need to get 9730 kB of archives.
After this operation, 2974 kB of additional disk space will be used.
Get:1 https://packages.cloud.google.com/apt kubernetes-xenial/main amd64 kubeadm amd64 1.26.0-00 [9730 kB]
Fetched 9730 kB in 20s (476 kB/s)
(Reading database ... 71636 files and directories currently installed.)
Preparing to unpack .../kubeadm_1.26.0-00_amd64.deb ...
Unpacking kubeadm (1.26.0-00) over (1.25.0-00) ...
Setting up kubeadm (1.26.0-00) ...
Scanning processes...
Scanning candidates...
Scanning linux images...

Running kernel seems to be up-to-date.

Restarting services...
Service restarts being deferred:
 /etc/needrestart/restart.d/dbus.service
 systemctl restart networkd-dispatcher.service
 systemctl restart systemd-logind.service
 systemctl restart unattended-upgrades.service
 systemctl restart user@0.service
```
    
Now we can check if the upgrade is available.

> kubeadm upgrade plan
    
Output :

```bash=
root@jeremy-tp-controlplane:~# kubeadm upgrade plan
[upgrade/config] Making sure the configuration is correct:
[upgrade/config] Reading configuration from the cluster...
[upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[preflight] Running pre-flight checks.
[upgrade] Running cluster health checks
[upgrade] Fetching available versions to upgrade to
[upgrade/versions] Cluster version: v1.25.6
[upgrade/versions] kubeadm version: v1.26.0
[upgrade/versions] Target version: v1.26.1
[upgrade/versions] Latest version in the v1.25 series: v1.25.6

W0206 13:44:15.735176   24181 configset.go:177] error unmarshaling configuration schema.GroupVersionKind{Group:"kubeproxy.config.k8s.io", Version:"v1alpha1", Kind:"KubeProxyConfiguration"}: strict decoding error: unknown field "udpIdleTimeout"
Components that must be upgraded manually after you have upgraded the control plane with 'kubeadm upgrade apply':
COMPONENT   CURRENT       TARGET
kubelet     3 x v1.25.0   v1.26.1

Upgrade to the latest stable version:

COMPONENT                 CURRENT   TARGET
kube-apiserver            v1.25.6   v1.26.1
kube-controller-manager   v1.25.6   v1.26.1
kube-scheduler            v1.25.6   v1.26.1
kube-proxy                v1.25.6   v1.26.1
CoreDNS                   v1.9.3    v1.9.3
etcd                      3.5.4-0   3.5.6-0

You can now apply the upgrade by executing the following command:

        kubeadm upgrade apply v1.26.1

Note: Before you can perform this upgrade, you have to update kubeadm to v1.26.1.

_____________________________________________________________________


The table below shows the current state of component configs as understood by this version of kubeadm.
Configs that have a "yes" mark in the "MANUAL UPGRADE REQUIRED" column require manual config upgrade or
resetting to kubeadm defaults before a successful upgrade can be performed. The version to manually
upgrade to is denoted in the "PREFERRED VERSION" column.

API GROUP                 CURRENT VERSION   PREFERRED VERSION   MANUAL UPGRADE REQUIRED
kubeproxy.config.k8s.io   v1alpha1          v1alpha1            no
kubelet.config.k8s.io     v1beta1           v1beta1             no
_____________________________________________________________________

```
    
Now we can upgrade the cluster.

> kubeadm upgrade apply v1.26.0
    
Output :

```bash=
[upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.26.0". Enjoy!

[upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
root@jeremy-tp-controlplane:~# 
```
    
Before upgrading kubelet, we need to drain the control plane node.

> kubectl drain <controlplane-node-name> --ignore-daemonsets
    
Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl drain jeremy-tp-controlplane --ignore-daemonsets
node/jeremy-tp-controlplane cordoned
Warning: ignoring DaemonSet-managed Pods: kube-system/kube-proxy-2wlv2, kube-system/weave-net-mwn9q
node/jeremy-tp-controlplane drained  
```
    
You can now upgrade kubelet

```
sudo apt-mark unhold kubelet && \
sudo apt update && apt install -y kubelet=1.26.0-00 && \
sudo apt-mark hold kubelet
```

Output :

```bash=
root@jeremy-tp-controlplane:~# sudo apt-mark unhold kubelet && \
> sudo apt update && apt install -y kubelet=1.26.0-00 && \      
> sudo apt-mark hold kubelet
Canceled hold on kubelet.
Hit:1 https://download.docker.com/linux/ubuntu jammy InRelease
Hit:2 https://ppa.launchpadcontent.net/scaleway/stable/ubuntu jammy InRelease
Get:4 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]       
Get:5 http://security.ubuntu.com/ubuntu jammy-security/multiverse amd64 c-n-f Metadata [240 B]
Get:3 https://packages.cloud.google.com/apt kubernetes-xenial InRelease [8993 B]
Ign:6 http://archive.ubuntu.com/ubuntu jammy InRelease          
Ign:7 http://archive.ubuntu.com/ubuntu jammy-updates InRelease  
Ign:8 http://archive.ubuntu.com/ubuntu jammy-backports InRelease
Ign:6 http://archive.ubuntu.com/ubuntu jammy InRelease
Ign:7 http://archive.ubuntu.com/ubuntu jammy-updates InRelease  
Ign:8 http://archive.ubuntu.com/ubuntu jammy-backports InRelease
Ign:6 http://archive.ubuntu.com/ubuntu jammy InRelease
Ign:7 http://archive.ubuntu.com/ubuntu jammy-updates InRelease  
Ign:8 http://archive.ubuntu.com/ubuntu jammy-backports InRelease
Err:6 http://archive.ubuntu.com/ubuntu jammy InRelease
  Cannot initiate the connection to archive.ubuntu.com:80 (2001:67c:1562::18). - connect (101: Network is unreachable) Cannot initiate the connection to archive.ubuntu.com:80 (2620:2d:4000:1::16). - connect (101: Network is unreachable) Cannot initiate the connection to archive.ubuntu.com:80 (2620:2d:4000:1::19). - connect (101: Network is unreachable) Could not connect to archive.ubuntu.com:80 (185.125.190.39), connection timed out Could not connect to archive.ubuntu.com:80 (91.189.91.39), connection timed out Could not connect to archive.ubuntu.com:80 (  Cannot initiate the connection to archive.ubuntu.com:80 (2001:67c:1562::18). - connect (101: Network is unreachable) Cannot initiate the connection to archive.ubuntu.com:80 (2620:2d:4000:1::16). - connect (101: Network is unreachable) Cannot initiate the connection to archive.ubuntu.com:80 (2620:2d:4000:1::19). - connect (101: Network is unreachable)
Fetched 120 kB in 38s (3157 B/s)
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
13 packages can be upgraded. Run 'apt list --upgradable' to see them.
W: https://download.docker.com/linux/ubuntu/dists/jammy/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
W: https://apt.kubernetes.io/dists/kubernetes-xenial/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details. 
W: Failed to fetch http://archive.ubuntu.com/ubuntu/dists/jammy/InRelease  Cannot initiate the connection to archive.ubuntu.com:80 (2001:67c:1562::18). - connect (101: Network is unreachable) Cannot initiate the connection to archive.ubuntu.com:80 (2620:2d:4000:1::16). - connect (101: Network is unreachable) Cannot initiate the connection to archive.ubuntu.com:80 (2620:2d:4000:1::19). - connect (101: Network is unreachable) Could not connect to archive.ubuntu.com:80 (185.125.190.39), connection timed out Could not connect to archive.ubuntu.com:80 (91.189.91.39), connection timed out Could not connect to archive.ubuntu.com:80 (185.125.190.36), connection timed out
W: Failed to fetch http://archive.ubuntu.com/ubuntu/dists/jammy-updates/InRelease  Cannot initiate the connection to archive.ubuntu.com:80 (2001:67c:1562::18). - connect (101: Network is 
unreachable) Cannot initiate the connection to archive.ubuntu.com:80 (2620:2d:4000:1::16). - connect (101: Network is unreachable) Cannot initiate the connection to archive.ubuntu.com:80 
(2620:2d:4000:1::19). - connect (101: Network is unreachable)
W: Failed to fetch http://archive.ubuntu.com/ubuntu/dists/jammy-backports/InRelease  Cannot initiate the connection to archive.ubuntu.com:80 (2001:67c:1562::18). - connect (101: Network is unreachable) Cannot initiate the connection to archive.ubuntu.com:80 (2620:2d:4000:1::16). - connect (101: Network is unreachable) Cannot initiate the connection to archive.ubuntu.com:80 (2620:2d:4000:1::19). - connect (101: Network is unreachable)
W: Some index files failed to download. They have been ignored, or old ones used instead.
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following packages will be upgraded:
  kubelet
1 upgraded, 0 newly installed, 0 to remove and 12 not upgraded.
Need to get 20.5 MB of archives.
After this operation, 7032 kB of additional disk space will be used.
Get:1 https://packages.cloud.google.com/apt kubernetes-xenial/main amd64 kubelet amd64 1.26.0-00 [20.5 MB]
Fetched 20.5 MB in 21s (997 kB/s)
(Reading database ... 71636 files and directories currently installed.)
Preparing to unpack .../kubelet_1.26.0-00_amd64.deb ...
Unpacking kubelet (1.26.0-00) over (1.25.0-00) ...
Setting up kubelet (1.26.0-00) ...
Scanning processes...
Scanning candidates...
Scanning linux images...

Running kernel seems to be up-to-date.

Restarting services...
Service restarts being deferred:
 /etc/needrestart/restart.d/dbus.service
 systemctl restart networkd-dispatcher.service
 systemctl restart systemd-logind.service
 systemctl restart unattended-upgrades.service
 systemctl restart user@0.service
```
    
Restart kubelet

```
sudo systemctl daemon-reload
sudo systemctl restart kubelet
```

Output :

```bash=
root@jeremy-tp-controlplane:~# sudo systemctl daemon-reload
root@jeremy-tp-controlplane:~# sudo systemctl restart kubelet  
```
    
Uncordon the control plane node

> kubectl uncordon controlplane
    
Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl uncordon jeremy-tp-controlplane
node/jeremy-tp-controlplane uncordoned  
```

### Upgrade worker nodes
    
First upgrade kubeadm
    
```
sudo apt-mark unhold kubeadm && \
sudo apt update && apt install -y kubeadm=1.26.0-00 && \
sudo apt-mark hold kubeadm
```

Output :

```bash=
Restarting services...
Service restarts being deferred:
 /etc/needrestart/restart.d/dbus.service
 systemctl restart networkd-dispatcher.service
 systemctl restart systemd-logind.service
 systemctl restart unattended-upgrades.service
 systemctl restart user@0.service
```

Then upgrade the node

> kubeadm upgrade node
    
Output :

```bash=
root@jeremy-tp-node-1:~# kubeadm upgrade node
[upgrade] Reading configuration from the cluster...
[upgrade] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[preflight] Running pre-flight checks
[preflight] Skipping prepull. Not a control plane node.
[upgrade] Skipping phase. Not a control plane node.
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[upgrade] The configuration for this node was successfully updated!
[upgrade] Now you should go ahead and upgrade the kubelet package using your package manager.
```
    
Before upgrading kubelet, we need to drain the worker node, so go on the controlplane and run:

> kubectl drain <worker-node-name> --ignore-daemonsets
    
Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl drain jeremy-tp-node-1 --ignore-daemonsets
node/jeremy-tp-node-1 cordoned
Warning: ignoring DaemonSet-managed Pods: kube-system/kube-proxy-v2t67, kube-system/weave-net-vw2lm
evicting pod kube-system/coredns-787d4945fb-rrkqc
Apod/coredns-787d4945fb-rrkqc evicted
node/jeremy-tp-node-1 drained
    
root@jeremy-tp-controlplane:~# kubectl drain jeremy-tp-node-2 --ignore-daemonsets
node/jeremy-tp-node-1 cordoned
Warning: ignoring DaemonSet-managed Pods: kube-system/kube-proxy-v2t67, kube-system/weave-net-vw2lm
evicting pod kube-system/coredns-787d4945fb-rrkqc
Apod/coredns-787d4945fb-rrkqc evicted
node/jeremy-tp-node-1 drained
```
    
You can now upgrade kubelet

```
sudo apt-mark unhold kubelet && \
sudo apt update && apt install -y kubelet=1.26.0-00 && \
sudo apt-mark hold kubelet
```
    
Output :

```bash=
root@jeremy-tp-controlplane:~# sudo apt-mark unhold kubelet && \
> sudo apt update && apt install -y kubelet=1.26.0-00 && \
> sudo apt-mark hold kubelet
Canceled hold on kubelet.
Hit:1 https://ppa.launchpadcontent.net/scaleway/stable/ubuntu jammy InRelease
Hit:2 https://download.docker.com/linux/ubuntu jammy InRelease                                                                                                          
Hit:4 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:5 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [114 kB]
Get:6 http://archive.ubuntu.com/ubuntu jammy-backports InRelease [107 kB]        
Get:7 http://archive.ubuntu.com/ubuntu jammy-updates/main amd64 Packages [856 kB]
Get:8 http://archive.ubuntu.com/ubuntu jammy-updates/main amd64 c-n-f Metadata [13.2 kB]
Get:9 http://archive.ubuntu.com/ubuntu jammy-updates/universe amd64 Packages [797 kB]
Get:3 https://packages.cloud.google.com/apt kubernetes-xenial InRelease [8993 B]
Hit:10 http://security.ubuntu.com/ubuntu jammy-security InRelease
Fetched 1896 kB in 31s (62.1 kB/s)
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
13 packages can be upgraded. Run 'apt list --upgradable' to see them.
W: https://download.docker.com/linux/ubuntu/dists/jammy/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
W: https://apt.kubernetes.io/dists/kubernetes-xenial/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
kubelet is already the newest version (1.26.0-00).
0 upgraded, 0 newly installed, 0 to remove and 12 not upgraded.
kubelet set on hold.   
```
    
Uncordon the worker node

> kubectl uncordon <worker-node-name>
    
Output :

```bash=
root@jeremy-tp-controlplane:~# kubectl uncordon jeremy-tp-node-1
node/jeremy-tp-node-1 uncordoned   
    
root@jeremy-tp-controlplane:~# kubectl uncordon jeremy-tp-node-2
node/jeremy-tp-node-1 uncordoned 
```


### Check that cluster is up

```bash=
root@jeremy-tp-controlplane:~# kubectl get nodes
NAME                     STATUS   ROLES           AGE   VERSION
jeremy-tp-controlplane   Ready    control-plane   74m   v1.26.0
jeremy-tp-node-1         Ready    worker          66m   v1.26.0
jeremy-tp-node-2         Ready    worker          66m   v1.26.0
```