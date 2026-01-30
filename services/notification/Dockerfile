FROM node:20-alpine
WORKDIR /app

# تثبيت pnpm
RUN npm install -g pnpm@9.15.5

# نسخ ملفات التعريف فقط أولاً للاستفادة من الكاش
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.base.json ./
COPY pnpm-lock.yaml ./

# تثبيت الحزم
RUN pnpm install --frozen-lockfile
RUN apk add --no-cache curl

# نسخ بقية الكود
COPY . .

# بناء المشروع (اختياري إذا كان هناك build script)
# RUN pnpm run build

EXPOSE 3005
CMD ["pnpm", "start"]
