#!/bin/bash

# Tạo thư mục certs nếu chưa có
mkdir -p certs

# 1. Tạo Root CA (Cơ quan chứng thực gốc)
openssl genrsa -out certs/rootCA-key.pem 2048
openssl req -x509 -new -nodes -key certs/rootCA-key.pem -sha256 -days 1024 -out certs/rootCA.pem \
  -subj "/C=VN/ST=Hanoi/L=Hanoi/O=PC Store/OU=IT/CN=PC Store Root CA"

# 2. Tạo Key cho Localhost
openssl genrsa -out certs/localhost-key.pem 2048

# 3. Tạo CSR (Yêu cầu ký chứng chỉ)
openssl req -new -key certs/localhost-key.pem -out certs/localhost.csr \
  -subj "/C=VN/ST=Hanoi/L=Hanoi/O=PC Store/OU=IT/CN=localhost"

# 4. Tạo file cấu hình mở rộng (Bắt buộc cho Chrome/Edge hiện đại)
cat <<EOT >> certs/localhost.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
EOT

# 5. Ký chứng chỉ localhost bằng Root CA
openssl x509 -req -in certs/localhost.csr -CA certs/rootCA.pem -CAkey certs/rootCA-key.pem \
-CAcreateserial -out certs/localhost-cert.pem -days 825 -sha256 -extfile certs/localhost.ext

# 6. Dọn dẹp file tạm
rm certs/localhost.csr certs/localhost.ext certs/rootCA.srl
echo "✅ Đã tạo xong bộ chứng chỉ SSL đồng bộ cho PC Store bên trong thư mục certs!"