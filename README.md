# 🍌 BANANA IPAD STORE - HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ IPAD CHÍNH HÃNG

<p align="center">
  <img src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&auto=format&fit=crop&q=80" alt="Banana iPad Store Banner" width="800" style="border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);" />
</p>

<p align="center">
  <b>Hệ thống bán lẻ iPad trực tuyến hiện đại với kiến trúc Monorepo (Spring Boot 3 + Angular), tích hợp Trợ lý Trí tuệ Nhân tạo Google Gemini RAG và Cổng thanh toán trực tuyến MoMo.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-3.2.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Java-17_LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17" />
  <img src="https://img.shields.io/badge/Angular-22.x-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Google_Gemini-3.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/MoMo_Payment-Gateway-A50064?style=for-the-badge&logo=momo&logoColor=white" alt="MoMo" />
  <img src="https://img.shields.io/badge/Database-H2_/_SQL_Server-CC292B?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" alt="Database" />
</p>

---

## 📑 Mục Lục
1. [Giới thiệu tổng quan](#-1-giới-thiệu-tổng-quan)
2. [Tính năng nổi bật](#-2-tính-năng-nổi-bật)
3. [Kiến trúc hệ thống & Công nghệ](#-3-kiến-trúc-hệ-thống--công-nghệ)
4. [Cấu trúc mã nguồn](#-4-cấu-trúc-mã-nguồn)
5. [Hướng dẫn cài đặt & Khởi chạy](#-5-hướng-dẫn-cài-đặt--khởi-chạy)
6. [Danh sách API Endpoints](#-6-danh-sách-api-endpoints)
7. [Dữ liệu thử nghiệm sẵn có](#-7-dữ-liệu-thử-nghiệm-sẵn-có)
8. [Tác giả](#-8-tác-giả)

---

## 🌟 1. Giới thiệu tổng quan

**Banana iPad Store** là dự án xây dựng nền tảng thương mại điện tử chuyên sâu về các thiết bị iPad của Apple (iPad Pro, iPad Air, iPad Mini, iPad Gen). Dự án được thiết kế chuẩn chỉ từ cơ sở dữ liệu quan hệ, tầng nghiệp vụ backend Spring Boot RESTful API đến giao diện tương tác người dùng hiện đại với Angular.

Điểm đột phá của dự án là việc ứng dụng **Trí tuệ Nhân tạo thế hệ mới (Google Gemini API)** theo cơ chế **RAG (Retrieval-Augmented Generation)** để tư vấn chọn máy chuẩn xác theo ngân sách và nhu cầu, kết hợp giải pháp thanh toán điện tử **MoMo Payment Gateway**.

---

## 🚀 2. Tính năng nổi bật

### 🛍️ Dành cho Khách hàng (Client Features)
- **Xem & Tìm kiếm sản phẩm thông minh:** Lọc theo dòng máy (*iPad Pro M4, iPad Air M2, iPad Mini 7, iPad Gen 10*), sắp xếp giá, tìm kiếm từ khóa thời gian thực.
- **Giỏ hàng & Đặt hàng linh hoạt:** Thêm/sửa/xóa sản phẩm, tính toán tự động tổng tiền, giảm giá. Hỗ trợ phương thức **COD (Nhận hàng thanh toán)** hoặc **Thanh toán trực tuyến MoMo**.
- **Theo dõi đơn hàng (Order Tracking):** Tra cứu đơn hàng theo mã hoặc tài khoản với thanh tiến trình trực quan 5 bước (*Chờ xác nhận -> Đang chuẩn bị -> Đang giao hàng -> Đã giao thành công -> Đã hủy*).
- **Đánh giá & Phản hồi (Product Reviews):** Khách hàng sau khi nhận hàng có thể xếp hạng sao (1 - 5 ⭐) và gửi nhận xét chi tiết kèm trải nghiệm thực tế.
- **Tài khoản người dùng:** Đăng ký, đăng nhập bảo mật với mật khẩu băm, quản lý thông tin nhận hàng.

### 🤖 Phân hệ Trợ lý AI Bán hàng (AI Chatbot with RAG & Guardrails)
- **Tư vấn thông minh:** Hỗ trợ giải đáp thắc mắc về chip vi xử lý (M4, M2, A17 Pro), dung lượng bộ nhớ, kích thước màn hình theo nhu cầu thực tế (học tập, vẽ đồ họa Procreate, dựng video, giải trí).
- **Cơ chế RAG (Retrieval-Augmented Generation):** Chatbot truy xuất trực tiếp danh mục và trạng thái tồn kho thực tế của cửa hàng trước khi trả lời, ngăn chặn hiện tượng ảo giác (Hallucination) và không tư vấn máy ngoài kho/hết hàng.
- **Gợi ý thẻ sản phẩm tương tác:** Tự động đề xuất các mẫu máy phù hợp nhất ngay trong khung chat để khách hàng bấm xem hoặc mua nhanh.

### 🛡️ Dành cho Quản trị viên (Admin Portal)
- **Quản lý Đơn hàng (Order Management):** Xem toàn bộ đơn hàng của hệ thống, lọc trạng thái, cập nhật trạng thái giao hàng, kiểm tra thông tin khách và địa chỉ giao.
- **Quản lý Đánh giá & Phản hồi (Reviews Management):** Theo dõi toàn bộ phản hồi của khách hàng và tính năng **Phản hồi của Admin** hiển thị công khai trên website.
- **Báo cáo Thống kê & Phân tích (Analytics Dashboard):**
  - Thống kê thời gian thực: Tổng doanh thu, Số lượng đơn hàng, Tổng khách hàng, Tổng sản phẩm.
  - Biểu đồ phân bổ cơ cấu dòng sản phẩm và tình hình bán chạy.

---

## 🛠️ 3. Kiến trúc hệ thống & Công nghệ

### Sơ đồ kiến trúc tổng thể:
```text
[ Client Browser (Angular 22 SPA) ]
                │
                │ HTTP RESTful API (JSON)
                ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND SPRING BOOT 3.2 (Java 17)          │
│  - Controllers: REST Endpoints (Products, Orders, ...)  │
│  - Services: Business Logic, Validation, MoMo Signature │
│  - AI Service: RAG Context Retrieval & Grounding        │
│  - Repositories: Spring Data JPA / Hibernate            │
└──────────────┬────────────────────────────┬─────────────┘
               │                            │
       JDBC Connection             HTTPS External API
               ▼                            ▼
┌───────────────────────────┐    ┌─────────────────────────┐
│ DATABASE ENGINE           │    │ THIRD-PARTY SERVICES    │
│ - H2 Database (Local Dev) │    │ - Google Gemini API     │
│ - MS SQL Server (Deploy)  │    │ - MoMo Payment Gateway  │
└───────────────────────────┘    └─────────────────────────┘
```

### Chi tiết Tech Stack:
| Thành phần | Công nghệ sử dụng | Phiên bản / Chi tiết |
| :--- | :--- | :--- |
| **Backend Framework** | Spring Boot | 3.2.4 (Java 17 LTS) |
| **ORM & Persistence** | Spring Data JPA / Hibernate | Jakarta Persistence 3.1 |
| **Frontend Framework** | Angular | 22.x (Standalone Components) |
| **Ngôn ngữ lập trình** | Java, TypeScript, HTML5, CSS3 | Clean Architecture |
| **Cơ sở dữ liệu** | H2 Database / MS SQL Server | Lưu trữ bền vững tại `./data/bananastore_db` |
| **Trí tuệ nhân tạo (AI)**| Google Gemini API | Model `gemini-3.5-flash` với kiến trúc RAG |
| **Cổng thanh toán** | Cổng MoMo Payment Gateway | Tích hợp mã hóa chữ ký HMAC SHA256 & QR Code |

---

## 📂 4. Cấu trúc mã nguồn

Dự án được cấu trúc theo dạng Monorepo gọn gàng, tách biệt rõ ràng giữa Backend và Frontend:

```text
banana-ipad-store/
├── backend-springboot/               # Ổ điều khiển Backend Spring Boot
│   ├── src/main/java/com/banana/store/
│   │   ├── config/                   # Cấu hình CORS (WebConfig.java)
│   │   ├── controller/               # REST API Controllers (Product, Order, Review, Chatbot...)
│   │   ├── dto/                      # Data Transfer Objects (Request/Response)
│   │   ├── entity/                   # JPA Entities (Product, Registration, Order, Review)
│   │   ├── repository/               # Spring Data JPA Interfaces
│   │   ├── service/                  # Business Logic & AI Services
│   │   └── BananaStoreApplication.java# Entry Point ứng dụng & Data Seeder
│   ├── src/main/resources/
│   │   └── application.properties    # Cấu hình CSDL, Port, API Key, Dialect
│   ├── pom.xml                       # Quản lý dependencies Maven
│   └── mvnw.cmd                      # Maven Wrapper
│
├── frontend/                         # Giao diện người dùng Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── models/               # Định nghĩa TypeScript Interfaces
│   │   │   ├── services/             # Angular Services gọi REST API
│   │   │   ├── app.component.html    # Template giao diện chính
│   │   │   ├── app.component.css     # Định dạng phong cách giao diện
│   │   │   └── app.component.ts      # Logic component, Modal & Event Handlers
│   │   ├── index.html                # Single Page HTML
│   │   └── main.ts                   # Bootstrap Application
│   ├── package.json                  # Dependencies NPM
│   └── angular.json                  # Cấu hình Angular CLI
│
├── .gitignore                        # Cấu hình loại bỏ file rác, build artifacts
└── README.md                         # Tài liệu hướng dẫn đồ án
```

---

## 🚀 5. Hướng dẫn cài đặt & Khởi chạy

### Yêu cầu tiên quyết (Prerequisites)
- **Java Development Kit (JDK):** Java 17 trở lên (`java -version`).
- **Node.js & NPM:** Node.js 18+ và npm 9+ (`node -v`, `npm -v`).
- **Trình duyệt Web:** Google Chrome, Microsoft Edge hoặc Safari.

---

### Bước 1: Khởi động Backend (Spring Boot)

Mở một cửa sổ Terminal (PowerShell hoặc Command Prompt) tại thư mục dự án:

```bash
cd backend-springboot

# Nếu đã có file JAR đóng gói sẵn:
java -jar target/banana-ipad-store-backend-1.0.0.jar

# Hoặc chạy trực tiếp bằng Maven Wrapper:
./mvnw.cmd spring-boot:run
```

- **Backend URL:** [http://localhost:8080](http://localhost:8080)
- **Trang kiểm tra Database (H2 Console):** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - *JDBC URL:* `jdbc:h2:file:./data/bananastore_db`
  - *Username:* `sa` | *Password:* `123456`

---

### Bước 2: Khởi động Frontend (Angular)

Mở một cửa sổ Terminal thứ hai tại thư mục dự án:

```bash
cd frontend

# Cài đặt các thư viện phụ thuộc (chỉ cần chạy lần đầu):
npm install

# Khởi chạy máy chủ phát triển Angular:
npm start
```

- **Website URL:** [http://localhost:4200](http://localhost:4200)

Truy cập [http://localhost:4200](http://localhost:4200) để trải nghiệm toàn bộ các tính năng mua sắm, chat AI và quản trị.

---

## 📡 6. Danh sách API Endpoints

| Nhóm API | Method | Endpoint | Mô tả chức năng |
| :--- | :---: | :--- | :--- |
| **Sản phẩm** | `GET` | `/api/products` | Lấy toàn bộ danh sách sản phẩm iPad |
| | `GET` | `/api/products/{id}` | Lấy chi tiết thông tin một sản phẩm |
| | `POST`| `/api/products` | Thêm mới sản phẩm (Quản trị viên) |
| **Đơn hàng** | `GET` | `/api/orders` | Danh sách đơn hàng cho Admin |
| | `GET` | `/api/orders/user/{username}` | Tra cứu lịch sử đơn hàng của người dùng |
| | `POST`| `/api/orders` | Tạo đơn đặt hàng mới |
| | `PUT` | `/api/orders/{id}/status` | Cập nhật trạng thái giao hàng |
| **Đánh giá** | `GET` | `/api/reviews` | Xem toàn bộ đánh giá (Admin) |
| | `GET` | `/api/reviews/product/{id}` | Xem đánh giá theo từng sản phẩm |
| | `POST`| `/api/reviews` | Khách hàng gửi đánh giá & xếp hạng sao |
| | `PUT` | `/api/reviews/{id}/reply` | Admin gửi câu trả lời phản hồi |
| **Thống kê** | `GET` | `/api/analytics/summary` | Lấy số liệu tổng doanh thu, đơn, người dùng |
| **AI Chat** | `POST`| `/api/chat` | Trò chuyện cùng trợ lý ảo Google Gemini |
| **MoMo** | `POST`| `/api/payment/momo/create` | Tạo URL thanh toán MoMo QR/Gateway |

---

## 👥 7. Dữ liệu thử nghiệm sẵn có

Hệ thống đã tích hợp sẵn cơ chế **Tự động khởi tạo dữ liệu mẫu (Auto Seed Data)** ngay khi khởi động:
- **17 sản phẩm iPad chính hãng:** Đầy đủ các dòng máy M4, M2, A17 Pro với hình ảnh chất lượng cao và thông số chuẩn.
- **17 tài khoản khách hàng:** Sẵn sàng kiểm thử tính năng đăng nhập và quản lý.
- **12 đơn hàng:** Đầy đủ các trạng thái từ Chờ duyệt đến Giao thành công với tổng doanh thu hơn 230 triệu VNĐ.
- **16 đánh giá & phản hồi:** Đi kèm câu trả lời của Admin để kiểm thử giao diện đánh giá thực tế.

---

## 👨‍💻 8. Tác giả

- **Họ và tên:** Nguyễn Văn Hiếu
- **Đề tài:** Xây dựng Hệ thống Thương mại Điện tử Phân phối iPad tích hợp Trợ lý Trí tuệ Nhân tạo & Cổng thanh toán trực tuyến.
- **GitHub Repository:** [https://github.com/hieunv2323/ipad.git](https://github.com/hieunv2323/ipad.git)

---
<p align="center">⭐ Nếu bạn thấy dự án hữu ích, hãy để lại 1 Star trên GitHub nhé! ⭐</p>
