# Kafka + Kubernetes Demo — Order Notification System

Two Spring Boot microservices connected through Kafka:

```
[client] --POST /orders--> [order-service] --publish--> [Kafka: "orders" topic] --consume--> [notification-service]
```

- **order-service** (port 8081): REST API that publishes order events to Kafka
- **notification-service** (port 8082): Consumes order events and logs a "notification"

---

## Prerequisites

- Java 17+ (`java -version`)
- Maven 3.8+ (`mvn -version`)
- Docker Desktop (with Kubernetes enabled, OR just Docker for the compose path)
- (Optional, for the Kubernetes path) `minikube` and `kubectl`

---

## Option A — Fastest: Docker Compose (no Kubernetes needed)

This is the quickest way to see everything working end-to-end.

```bash
# 1. Build both jars
cd order-service && mvn clean package -DskipTests && cd ..
cd notification-service && mvn clean package -DskipTests && cd ..

# 2. Build images and start everything (Kafka, Zookeeper, both services)
docker compose up --build
```

Wait ~30–60 seconds for Kafka to fully start, then in another terminal:

```bash
# 3. Place an order
curl -X POST http://localhost:8081/orders \
  -H "Content-Type: application/json" \
  -d '{"orderId":"O1001","product":"Laptop","quantity":1}'

# 4. Check that notification-service received and processed it
curl http://localhost:8082/notifications
```

You should see the order echoed back, and in the `docker compose` terminal a log line like:
```
notification-service_1  | Notification sent for order [O1001] - product: Laptop, quantity: 1
```

Stop everything with `Ctrl+C`, then `docker compose down`.

---

## Option B — Kubernetes (minikube)

This is closer to how it would run in production and is what your resume bullet should describe.

```bash
# 1. Start a local cluster
minikube start

# 2. Build the jars
cd order-service && mvn clean package -DskipTests && cd ..
cd notification-service && mvn clean package -DskipTests && cd ..

# 3. Point your Docker CLI at minikube's internal Docker daemon,
#    so the images you build are visible to the cluster (no registry push needed)
eval $(minikube docker-env)          # Windows PowerShell: & minikube -p minikube docker-env | Invoke-Expression

docker build -t order-service:1.0 ./order-service
docker build -t notification-service:1.0 ./notification-service

# 4. Deploy Kafka, then both services
kubectl apply -f k8s/01-kafka.yaml
kubectl apply -f k8s/02-order-service.yaml
kubectl apply -f k8s/03-notification-service.yaml

# 5. Watch pods until everything is Running (Kafka takes ~30-60s to be ready)
kubectl get pods -w
```

Once all pods show `Running`:

```bash
# 6. Get minikube's IP
minikube ip

# 7. Place an order (replace <minikube-ip> with the output above)
curl -X POST http://<minikube-ip>:30081/orders \
  -H "Content-Type: application/json" \
  -d '{"orderId":"O2001","product":"Keyboard","quantity":2}'

# 8. Check notification-service received it
curl http://<minikube-ip>:30082/notifications

# or tail the logs directly
kubectl logs -f deployment/notification-service
```

### Cleaning up

```bash
kubectl delete -f k8s/03-notification-service.yaml
kubectl delete -f k8s/02-order-service.yaml
kubectl delete -f k8s/01-kafka.yaml
minikube stop
```

---

## Troubleshooting

- **"Connection refused" from order-service to Kafka**: Kafka takes longer to start than the app. Wait 30–60s and retry, or add a readiness check.
- **`ImagePullBackOff` in Kubernetes**: You forgot `eval $(minikube docker-env)` before building — the image was built in your host Docker, not minikube's.
- **Consumer never receives messages**: Check `kubectl logs -f deployment/kafka` for errors, and confirm `KAFKA_ADVERTISED_LISTENERS` matches the service name (`kafka-service`), not `localhost`.
- **Port already in use locally**: Change the `ports` mapping in `docker-compose.yml` or the `nodePort` in the k8s YAML.

---

## Suggested next steps (stretch goals)

1. Add a **Dead Letter Topic** (`orders-dlq`) for messages that fail processing repeatedly.
2. Add **Prometheus + Grafana** to monitor consumer lag (`kafka-exporter` Helm chart).
3. Replace raw Kafka YAML with the **Strimzi Kafka Operator** — how most real clusters run Kafka on K8s.
4. Wrap both services in a **Helm chart** instead of raw manifests.
5. Add a **DLQ + retry** using Spring Kafka's `DefaultErrorHandler`.

Once you've done a couple of these, you can honestly update your resume bullet from "explored/prototyped" to "designed and deployed."
