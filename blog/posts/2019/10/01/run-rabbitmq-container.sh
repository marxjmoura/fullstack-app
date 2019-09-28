docker run -d \
  --name rabbitmq \
  --hostname rabbitmq \
  --restart=always \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3.7.18-management
