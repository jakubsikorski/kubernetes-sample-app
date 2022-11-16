# kubernetes-sample-app

## Purpose

A simple set of microservices, done to learn and demonstrate Kubernetes capabilities. It consists of 4 microservices:
    - frontend service, available on a NodePort (default port 30008),
    - backend service, accessed from frontend panel when you submit your request or directly on NodePort,
    - postgresql database, to which backend inserts your inputs,
    - redis as cache, where previously calculated results are read from cache, not calculated again.
    
The app has ingress support.

The purpose of the app is to say if input is a prime number or not. Basic usage is simply for debugging purposes, where one client->server
isn't sufficient and you need something more complex but not convoluted and something easy to change.


## Prerequisites
- a working kubernetes cluster, version 1.22+
- docker, to build the images

## Available endpoints
- `<ingress-ctrl-ip>:<ingressport>/` - available frontend, accessible by browser,
- `<ingress-ctrl-ip>:<ingressport>/api/<number>` - available direct backend response,
- `myfrontend-service:80/` - frontend service reachable inside kubernetes network (resolves to cluster-ip)
- `mybackend-service:5000/<number>` - backend service reachable inside k8s network
- `mypostgres-service:5432` - postgres service, backend sends sql queries to this svc
- `myredis-service` - redis service, backend connects to this svc

You can see in the backend logs if your request with your specific number has reached the server.

On the logs of postgres you can see if backend request tried inserting anything into the database.

On the output from backend you can see if there is correct connection to redis client, as the output will be different if read from cache.
    
## Structure
* manifests directory contains:
    * `my-cluster directory`, with all kubernetes manifests
    * `deploy.yml` - file that includes all of the manifests in the aforementioned directory -
                    use this to simply deploy everything with `kubectl apply -f deploy.yml`
* src directory:
    * backend directory:
        Source code of the backend service, most important files:
        * `index.js` - this is where the actual code made in node.js is to calculate the prime, send data to database or contact redis
        * `keys.js` - values needed to contact redis/pgsql endpoints
        * `Dockerfile` - Dockerfile used to create the service
    * frontend directory:
        Source code of the frontend service, most important files:
        * `src/components/prime.js` - this is the entire react code responsible for the frontend app
        * `Dockerfile.dev` - Dockerfile used to create the frontend service, you can build it with `docker build -f Dockerfile.dev .`
