# kubdocker
Docker Container on Kubernetes

`$ git clone https://github.com/faizalpribadi/kubdocker`

`$ cd kubdocker`

`$ docker build -t auth-service:v1 . `


After build finished, check image is available `docker images`

`$ cd kubernetes-config`

`$ kubectl create -f mongo-service.yaml`

`$ kubectl create -f mongo-controller.yaml`

`$ kubectl create -f auth-service.yaml`

`$ kubectl create -f auth-controller.yaml`


After all, check node run on kubernetes `minikube dashboard`
and you can access by port forwarding the node into localhost

`$ kubectl port-forward <auth-service-xxx> 4000:4000`


And test the service

`$ http POST http://localhost:4000/auth/register \
username="me" \
password="pass"`