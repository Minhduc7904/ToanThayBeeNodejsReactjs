# Sử dụng Node.js LTS làm base image
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ source code vào container
COPY . .

# Expose cổng ứng dụng (Cloud Run mặc định dùng biến PORT)
EXPOSE 8080

# Lệnh khởi chạy ứng dụng
CMD ["npm", "start"]
