import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistrationService } from './services/registration.service';
import { ProductService } from './services/product.service';
import { ChatbotService } from './services/chatbot.service';
import { OrderService, Order, CreateOrderInput } from './services/order.service';
import { ReviewService, Review, CreateReviewInput } from './services/review.service';
import { AnalyticsService, AnalyticsSummary } from './services/analytics.service';
import { Product, RegistrationInput, RegistrationUser, CreateProductInput } from './models/registration.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Banana Store - iPad giá rẻ Hà Nội';

  // Shopping Cart State
  cartItems: CartItem[] = [];
  showCartModal: boolean = false;
  toastMessage: string = '';

  // Navigation & Search State
  searchQuery: string = '';
  selectedSeries: string = 'All';
  selectedCapacity: string = 'All';
  sortBy: string = 'featured';

  // Admin Mode & Authentication State
  isAdminMode: boolean = false; // Requires password to enable
  showAdminAuthModal: boolean = false;
  adminPasswordInput: string = '';
  adminAuthError: string = '';
  pendingAdminAction: string | null = null;

  // Modals state
  showAddProductModal: boolean = false;
  showEditProductModal: boolean = false;
  showRegisterModal: boolean = false;
  showCustomersModal: boolean = false;
  showOrdersModal: boolean = false;
  showAnalyticsModal: boolean = false;
  showReviewsModal: boolean = false;
  showCustomerOrdersModal: boolean = false;
  showAuthModal: boolean = false;
  showDetailModal: boolean = false;
  selectedDetailProduct: Product | null = null;
  authTab: 'login' | 'register' = 'login';

  // Login Form
  loginForm = { username: '', password: '' };
  loggedInUser: any = null;

  // Checkout & Cart State
  showCheckoutModal: boolean = false;
  checkoutProduct: Product | null = null;
  checkoutQuantity: number = 1;
  shippingAddress: string = '';
  orderNote: string = '';
  paymentMethod: 'COD' | 'VNPAY' | 'MOMO' | 'INSTALLMENT' = 'COD';
  orderSuccessMessage: string = '';
  orderLoading: boolean = false;

  // Products State
  products: Product[] = [];
  productsLoading: boolean = false;
  productsError: string = '';

  // Form State - Register
  registerForm: RegistrationInput = {
    fullName: '',
    phoneNumber: '',
    address: '',
    username: '',
    password: ''
  };
  formLoading: boolean = false;
  formError: string = '';
  formSuccess: string = '';
  registeredDataPreview: RegistrationUser | null = null;

  // Form State - Add Product (Admin)
  addProductForm: CreateProductInput = {
    name: '',
    series: 'Pro',
    capacity: '256GB',
    color: 'Space Black',
    price: 25990000,
    originalPrice: 27990000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    badge: 'Hàng Mới Về',
    isHot: true
  };
  addProductLoading: boolean = false;
  addProductError: string = '';
  addProductSuccess: string = '';

  // Form State - Edit Product (Admin)
  editingProductId: string | null = null;
  editProductForm: CreateProductInput = {
    name: '',
    series: 'Pro',
    capacity: '256GB',
    color: '',
    price: 0,
    originalPrice: 0,
    image: '',
    badge: '',
    isHot: false
  };
  editProductLoading: boolean = false;
  editProductError: string = '';
  editProductSuccess: string = '';

  // Sample Image Presets for Admin quick select
  sampleImages = [
    { label: 'Space Black / Gray', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80' },
    { label: 'Silver / Starlight', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80' },
    { label: 'Blue / Purple / Pink', url: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&auto=format&fit=crop&q=80' }
  ];

  // Customers List State
  customersList: RegistrationUser[] = [];
  customersLoading: boolean = false;
  customersError: string = '';
  customerSearchQuery: string = '';

  // Orders State (Admin)
  ordersList: Order[] = [];
  ordersLoading: boolean = false;
  ordersError: string = '';
  orderSearchQuery: string = '';
  selectedOrderStatusFilter: string = 'ALL';
  updatingOrderId: string | null = null;
  selectedOrderForDetail: Order | null = null;

  // Analytics State (Admin)
  showAnalyticsModalState: boolean = false;
  analyticsData: AnalyticsSummary | null = null;
  analyticsLoading: boolean = false;
  analyticsError: string = '';

  // Reviews State (Admin)
  reviewsList: Review[] = [];
  reviewsLoading: boolean = false;
  reviewsError: string = '';
  reviewRatingFilter: string = 'ALL';
  reviewStatusFilter: string = 'ALL';
  reviewSearchQuery: string = '';
  replyingReviewId: string | null = null;
  adminReplyText: string = '';
  reviewReplyLoading: boolean = false;

  // Product Detail Reviews State (Customer)
  productReviews: Review[] = [];
  productReviewsLoading: boolean = false;
  newReviewRating: number = 5;
  newReviewComment: string = '';
  newReviewName: string = '';
  submitReviewLoading: boolean = false;
  submitReviewSuccess: string = '';
  submitReviewError: string = '';

  // Customer Order Tracking & Post-purchase Review State
  customerOrdersList: Order[] = [];
  customerOrdersLoading: boolean = false;
  customerOrdersError: string = '';
  trackingQueryInput: string = '';
  cancellingOrderId: string | null = null;
  reviewingOrder: Order | null = null;
  orderReviewRating: number = 5;
  orderReviewComment: string = '';
  orderReviewSubmitting: boolean = false;
  orderReviewSuccess: string = '';
  orderReviewError: string = '';

  // Chatbot Gemini AI State
  showChatbot: boolean = false;
  userChatMessage: string = '';
  chatLoading: boolean = false;
  unreadChatCount: number = 1;
  chatMessages: Array<{
    sender: 'user' | 'bot';
    text: string;
    recommendedProducts?: Product[];
    isAi?: boolean;
    time?: string;
  }> = [
    {
      sender: 'bot',
      text: '👋 **Xin chào bạn!** Mình là **Trợ Lý AI của Banana Store** 🍌.\nBạn đang tìm chọn mua iPad hay máy tính phù hợp với nhu cầu gì (học tập, đồ họa, chơi game) và ngân sách khoảng bao nhiêu?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: true
    }
  ];

  quickPrompts: string[] = [
    '💡 Tư vấn iPad dưới 15 triệu',
    '🎨 iPad tốt nhất cho vẽ & đồ họa?',
    '🎓 iPad cho học sinh sinh viên',
    '🚀 So sánh iPad Air và iPad Pro'
  ];

  constructor(
    private regService: RegistrationService,
    private productService: ProductService,
    private chatbotService: ChatbotService,
    private orderService: OrderService,
    private reviewService: ReviewService,
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
    if (this.showChatbot) {
      this.unreadChatCount = 0;
      this.scrollChatToBottom();
    }
    this.cdr.markForCheck();
  }

  sendQuickPrompt(promptText: string): void {
    this.userChatMessage = promptText;
    this.sendChatMessage();
  }

  sendChatMessage(): void {
    const msg = this.userChatMessage?.trim();
    if (!msg || this.chatLoading) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    this.chatMessages.push({
      sender: 'user',
      text: msg,
      time: nowStr
    });

    this.userChatMessage = '';
    this.chatLoading = true;
    this.scrollChatToBottom();
    this.cdr.markForCheck();

    // Send to backend Gemini service
    const historyDto = this.chatMessages
      .filter(m => m.text)
      .slice(-6)
      .map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        content: m.text
      }));

    this.chatbotService.sendMessage(msg, historyDto).subscribe({
      next: (res) => {
        this.chatLoading = false;
        if (res.success && res.data) {
          this.chatMessages.push({
            sender: 'bot',
            text: res.data.reply,
            recommendedProducts: res.data.recommendedProducts,
            isAi: res.data.isAiGenerated,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        } else {
          this.chatMessages.push({
            sender: 'bot',
            text: 'Xin lỗi, hiện tại tư vấn AI đang bận. Vui lòng thử lại sau!',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
        this.scrollChatToBottom();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.chatLoading = false;
        this.chatMessages.push({
          sender: 'bot',
          text: 'Không thể kết nối dịch vụ Gemini AI. Vui lòng kiểm tra kết nối mạng hoặc backend Spring Boot.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        this.scrollChatToBottom();
        this.cdr.markForCheck();
      }
    });
  }

  scrollChatToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.getElementById('chatMessagesBox');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }


  ngOnInit(): void {
    this.loadProducts();
    this.restoreUserSession();
    this.restoreCartFromStorage();
    this.fetchOrdersList();
    this.fetchReviewsList();
  }

  restoreUserSession(): void {
    try {
      const savedUser = localStorage.getItem('banana_logged_user');
      if (savedUser) {
        this.loggedInUser = JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Lỗi khôi phục phiên đăng nhập:', e);
    }
  }

  saveUserSession(user: any): void {
    this.loggedInUser = user;
    try {
      localStorage.setItem('banana_logged_user', JSON.stringify(user));
    } catch (e) {
      console.error('Lỗi lưu phiên đăng nhập:', e);
    }
  }

  // Fetch Products from Backend D1
  loadProducts(): void {
    this.productsLoading = true;
    this.productsError = '';
    this.cdr.markForCheck();
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.productsLoading = false;
        if (res.success && res.data) {
          this.products = res.data;
        } else {
          this.productsError = 'Không thể tải danh sách sản phẩm.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.productsLoading = false;
        this.productsError = err.error?.message || 'Lỗi khi kết nối API sản phẩm.';
        this.cdr.markForCheck();
      }
    });
  }

  // Change Password State
  showChangePasswordModal: boolean = false;
  currentPasswordInput: string = '';
  newPasswordInput: string = '';
  confirmNewPasswordInput: string = '';
  changePasswordError: string = '';
  changePasswordSuccess: string = '';

  // Get Admin Password from storage or default
  getAdminPassword(): string {
    return localStorage.getItem('banana_admin_password') || 'admin123';
  }

  // Admin Authentication & Mode Toggle
  toggleAdminMode(): void {
    if (this.isAdminMode) {
      this.isAdminMode = false;
    } else {
      this.openAdminAuthModal();
    }
  }

  openAdminAuthModal(): void {
    this.showAdminAuthModal = true;
    this.adminPasswordInput = '';
    this.adminAuthError = '';
  }

  closeAdminAuthModal(): void {
    this.showAdminAuthModal = false;
    this.adminPasswordInput = '';
    this.adminAuthError = '';
  }

  submitAdminAuth(): void {
    this.adminAuthError = '';
    if (!this.adminPasswordInput) {
      this.adminAuthError = 'Vui lòng nhập mật khẩu quản trị.';
      this.cdr.markForCheck();
      return;
    }

    if (this.adminPasswordInput === this.getAdminPassword()) {
      this.isAdminMode = true;
      this.closeAdminAuthModal();

      if (this.pendingAdminAction === 'customers') {
        this.pendingAdminAction = null;
        this.showCustomersModal = true;
        this.fetchCustomersList();
      } else if (this.pendingAdminAction === 'orders') {
        this.pendingAdminAction = null;
        this.showOrdersModal = true;
        this.fetchOrdersList();
      } else if (this.pendingAdminAction === 'analytics') {
        this.pendingAdminAction = null;
        this.showAnalyticsModal = true;
        this.fetchAnalytics();
      } else if (this.pendingAdminAction === 'reviews') {
        this.pendingAdminAction = null;
        this.showReviewsModal = true;
        this.fetchReviewsList();
      }
      this.cdr.markForCheck();
    } else {
      this.adminAuthError = 'Mật khẩu quản trị không đúng! Vui lòng thử lại.';
      this.cdr.markForCheck();
    }
  }

  logoutAdmin(): void {
    this.isAdminMode = false;
  }

  // Modal Handlers - Change Password
  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
    this.currentPasswordInput = '';
    this.newPasswordInput = '';
    this.confirmNewPasswordInput = '';
    this.changePasswordError = '';
    this.changePasswordSuccess = '';
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
  }

  submitChangePassword(): void {
    this.changePasswordError = '';
    this.changePasswordSuccess = '';

    if (!this.currentPasswordInput) {
      this.changePasswordError = 'Vui lòng nhập mật khẩu hiện tại.';
      return;
    }

    if (this.currentPasswordInput !== this.getAdminPassword()) {
      this.changePasswordError = 'Mật khẩu hiện tại không chính xác.';
      return;
    }

    if (!this.newPasswordInput || this.newPasswordInput.length < 4) {
      this.changePasswordError = 'Mật khẩu mới phải có ít nhất 4 ký tự.';
      return;
    }

    if (this.newPasswordInput !== this.confirmNewPasswordInput) {
      this.changePasswordError = 'Mật khẩu xác nhận không trùng khớp.';
      return;
    }

    // Save new password into localStorage
    localStorage.setItem('banana_admin_password', this.newPasswordInput);
    this.changePasswordSuccess = 'Đổi mật khẩu Admin thành công! Vui lòng ghi nhớ mật khẩu mới.';

    setTimeout(() => {
      this.closeChangePasswordModal();
    }, 1200);
  }

  // Filtered Products Getter
  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchSeries = this.selectedSeries === 'All' ||
        p.series === this.selectedSeries ||
        p.series.toLowerCase().includes(this.selectedSeries.toLowerCase()) ||
        this.selectedSeries.toLowerCase().includes(p.series.toLowerCase());
      const matchCapacity = this.selectedCapacity === 'All' || p.capacity === this.selectedCapacity;
      const matchQuery = !this.searchQuery || p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchSeries && matchCapacity && matchQuery;
    }).sort((a, b) => {
      if (this.sortBy === 'price-low') return a.price - b.price;
      if (this.sortBy === 'price-high') return b.price - a.price;
      if (this.sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return 0;
    });
  }

  // Modal Handlers - Add Product
  openAddProductModal(): void {
    if (!this.isAdminMode) {
      this.openAdminAuthModal();
      this.adminAuthError = 'Vui lòng mở khóa quyền Admin để thêm sản phẩm mới!';
      this.cdr.markForCheck();
      return;
    }
    this.showAddProductModal = true;
    this.addProductError = '';
    this.addProductSuccess = '';
    this.cdr.markForCheck();
  }

  closeAddProductModal(): void {
    this.showAddProductModal = false;
    this.cdr.markForCheck();
  }

  selectSampleImage(url: string): void {
    this.addProductForm.image = url;
    this.cdr.markForCheck();
  }

  // Submit Add Product Form (Admin)
  submitAddProduct(): void {
    this.addProductError = '';
    this.addProductSuccess = '';

    if (!this.addProductForm.name?.trim() ||
        !this.addProductForm.series?.trim() ||
        !this.addProductForm.capacity?.trim() ||
        !this.addProductForm.color?.trim() ||
        !this.addProductForm.image?.trim()) {
      this.addProductError = 'Vui lòng nhập đầy đủ tên, dòng máy, dung lượng, màu sắc và hình ảnh sản phẩm.';
      this.cdr.markForCheck();
      return;
    }

    if (!this.addProductForm.price || this.addProductForm.price <= 0) {
      this.addProductError = 'Giá bán sản phẩm phải lớn hơn 0.';
      this.cdr.markForCheck();
      return;
    }

    this.addProductLoading = true;
    this.cdr.markForCheck();

    this.productService.addProduct({
      name: this.addProductForm.name.trim(),
      series: this.addProductForm.series,
      capacity: this.addProductForm.capacity,
      color: this.addProductForm.color.trim(),
      price: Number(this.addProductForm.price),
      originalPrice: Number(this.addProductForm.originalPrice || this.addProductForm.price),
      image: this.addProductForm.image.trim(),
      badge: this.addProductForm.badge?.trim(),
      isHot: Boolean(this.addProductForm.isHot)
    }).subscribe({
      next: (res) => {
        this.addProductLoading = false;
        if (res.success && res.data) {
          this.addProductSuccess = 'Thêm sản phẩm mới thành công!';
          this.products = [res.data, ...this.products];
          this.showToast(`Đã thêm mới sản phẩm "${res.data.name}"!`);
          
          this.addProductForm = {
            name: '',
            series: 'Pro',
            capacity: '256GB',
            color: 'Space Black',
            price: 25990000,
            originalPrice: 27990000,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
            badge: 'Hàng Mới Về',
            isHot: true
          };

          setTimeout(() => {
            this.closeAddProductModal();
          }, 600);
        } else {
          this.addProductError = res.message || 'Thêm sản phẩm thất bại.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.addProductLoading = false;
        this.addProductError = err.error?.message || 'Lỗi khi gửi yêu cầu thêm sản phẩm.';
        this.cdr.markForCheck();
      }
    });
  }

  // Modal Handlers - Edit Product
  openEditProductModal(product: Product, event: Event): void {
    event.stopPropagation();
    if (!this.isAdminMode) {
      this.openAdminAuthModal();
      this.adminAuthError = 'Vui lòng mở khóa quyền Admin để chỉnh sửa sản phẩm!';
      this.cdr.markForCheck();
      return;
    }
    this.editingProductId = product.id;
    this.editProductForm = {
      name: product.name,
      series: product.series,
      capacity: product.capacity,
      color: product.color,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image,
      badge: product.badge || '',
      isHot: Boolean(product.isHot)
    };
    this.editProductError = '';
    this.editProductSuccess = '';
    this.showEditProductModal = true;
    this.cdr.markForCheck();
  }

  closeEditProductModal(): void {
    this.showEditProductModal = false;
    this.editingProductId = null;
    this.cdr.markForCheck();
  }

  selectSampleImageForEdit(url: string): void {
    this.editProductForm.image = url;
    this.cdr.markForCheck();
  }

  // Submit Edit Product Form (Admin)
  submitEditProduct(): void {
    if (!this.editingProductId) return;

    this.editProductError = '';
    this.editProductSuccess = '';

    if (!this.editProductForm.name?.trim() ||
        !this.editProductForm.series?.trim() ||
        !this.editProductForm.capacity?.trim() ||
        !this.editProductForm.color?.trim() ||
        !this.editProductForm.image?.trim()) {
      this.editProductError = 'Vui lòng nhập đầy đủ thông tin sản phẩm.';
      this.cdr.markForCheck();
      return;
    }

    if (!this.editProductForm.price || this.editProductForm.price <= 0) {
      this.editProductError = 'Giá bán phải lớn hơn 0.';
      this.cdr.markForCheck();
      return;
    }

    this.editProductLoading = true;
    this.cdr.markForCheck();

    this.productService.updateProduct(this.editingProductId, {
      name: this.editProductForm.name.trim(),
      series: this.editProductForm.series,
      capacity: this.editProductForm.capacity,
      color: this.editProductForm.color.trim(),
      price: Number(this.editProductForm.price),
      originalPrice: Number(this.editProductForm.originalPrice || this.editProductForm.price),
      image: this.editProductForm.image.trim(),
      badge: this.editProductForm.badge?.trim(),
      isHot: Boolean(this.editProductForm.isHot)
    }).subscribe({
      next: (res) => {
        this.editProductLoading = false;
        if (res.success && res.data) {
          this.editProductSuccess = 'Cập nhật sản phẩm thành công!';
          const idx = this.products.findIndex(p => p.id === this.editingProductId);
          if (idx !== -1) {
            this.products[idx] = res.data;
            this.products = [...this.products];
          }
          this.showToast(`Đã cập nhật sản phẩm "${res.data.name}"!`);

          setTimeout(() => {
            this.closeEditProductModal();
          }, 600);
        } else {
          this.editProductError = res.message || 'Cập nhật thất bại.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.editProductLoading = false;
        this.editProductError = err.error?.message || 'Lỗi khi cập nhật sản phẩm.';
        this.cdr.markForCheck();
      }
    });
  }

  // Delete Product (Admin)
  deleteProduct(product: Product, event: Event): void {
    event.stopPropagation();
    if (!this.isAdminMode) {
      this.openAdminAuthModal();
      this.adminAuthError = 'Vui lòng mở khóa quyền Admin để xóa sản phẩm!';
      this.cdr.markForCheck();
      return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}" khỏi cửa hàng không?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.products = this.products.filter(p => p.id !== product.id);
            this.showToast(`Đã xóa sản phẩm "${product.name}" thành công!`);
          } else {
            alert('Không thể xóa sản phẩm: ' + (res.message || 'Lỗi hệ thống'));
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          alert('Không thể xóa sản phẩm: ' + (err.error?.message || 'Lỗi hệ thống'));
          this.cdr.markForCheck();
        }
      });
    }
  }

  // Modal Handlers - Auth (Login/Register)
  openAuthModal(tab: 'login' | 'register' = 'login'): void {
    this.authTab = tab;
    this.showAuthModal = true;
    this.clearAuthMessages();
  }

  // Product Detail Modal Handlers
  openDetailModal(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedDetailProduct = product;
    this.showDetailModal = true;
    this.loadProductReviews(product.id);
    this.cdr.markForCheck();
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedDetailProduct = null;
    this.productReviews = [];
    this.submitReviewSuccess = '';
    this.submitReviewError = '';
    this.cdr.markForCheck();
  }

  // Checkout / Buy Now Handlers
  buyNow(product?: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (!this.loggedInUser) {
      this.openAuthModal('login');
      this.formError = 'Vui lòng đăng nhập để thực hiện mua hàng!';
      this.cdr.markForCheck();
      return;
    }

    const targetProduct = product || (this.products.length > 0 ? this.products[0] : null);
    if (!targetProduct) return;

    this.checkoutProduct = targetProduct;
    this.checkoutQuantity = 1;
    this.shippingAddress = this.loggedInUser.address || '';
    this.orderNote = '';
    this.paymentMethod = 'COD';
    this.orderSuccessMessage = '';
    this.showCheckoutModal = true;
    this.cdr.markForCheck();
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal = false;
    this.checkoutProduct = null;
    this.orderSuccessMessage = '';
    this.cdr.markForCheck();
  }

  increaseQuantity(): void {
    this.checkoutQuantity++;
    this.cdr.markForCheck();
  }

  decreaseQuantity(): void {
    if (this.checkoutQuantity > 1) {
      this.checkoutQuantity--;
      this.cdr.markForCheck();
    }
  }

  get getTotalOrderPrice(): number {
    return this.checkoutProduct ? this.checkoutProduct.price * this.checkoutQuantity : 0;
  }

  // Cart Actions
  addToCart(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (!this.loggedInUser) {
      this.openAuthModal('login');
      this.formError = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!';
      this.cdr.markForCheck();
      return;
    }

    const existingIndex = this.cartItems.findIndex(item => item.product.id === product.id);
    if (existingIndex !== -1) {
      this.cartItems[existingIndex].quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }

    this.showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
    this.saveCartToStorage();
    this.cdr.markForCheck();
  }

  openCartModal(): void {
    if (!this.loggedInUser) {
      this.openAuthModal('login');
      this.formError = 'Vui lòng đăng nhập để xem giỏ hàng!';
      this.cdr.markForCheck();
      return;
    }
    this.showCartModal = true;
    this.cdr.markForCheck();
  }

  closeCartModal(): void {
    this.showCartModal = false;
    this.cdr.markForCheck();
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.saveCartToStorage();
    this.cdr.markForCheck();
  }

  updateCartQty(index: number, delta: number): void {
    const newQty = this.cartItems[index].quantity + delta;
    if (newQty > 0) {
      this.cartItems[index].quantity = newQty;
    } else {
      this.removeFromCart(index);
    }
    this.saveCartToStorage();
    this.cdr.markForCheck();
  }

  get totalCartItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  get totalCartPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  proceedCartToCheckout(): void {
    if (this.cartItems.length === 0) return;
    this.closeCartModal();

    const mainItem = this.cartItems[0];
    this.checkoutProduct = mainItem.product;
    this.checkoutQuantity = this.totalCartItems;
    this.shippingAddress = this.loggedInUser ? this.loggedInUser.address : '';
    this.orderNote = `Đơn hàng từ giỏ hàng (${this.cartItems.length} mặt hàng)`;
    this.paymentMethod = 'COD';
    this.orderSuccessMessage = '';
    this.showCheckoutModal = true;
    this.cdr.markForCheck();
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.toastMessage = '';
      this.cdr.markForCheck();
    }, 2500);
  }

  saveCartToStorage(): void {
    try {
      localStorage.setItem('banana_cart_items', JSON.stringify(this.cartItems));
    } catch (e) {}
  }

  restoreCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('banana_cart_items');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
      }
    } catch (e) {}
  }

  submitOrder(): void {
    if (!this.checkoutProduct) return;

    if (!this.shippingAddress?.trim()) {
      alert('Vui lòng nhập địa chỉ nhận hàng!');
      return;
    }

    this.orderLoading = true;
    this.cdr.markForCheck();

    const orderPayload: CreateOrderInput = {
      customerName: this.loggedInUser?.fullName || 'Khách vãng lai',
      customerPhone: this.loggedInUser?.phoneNumber || '0900000000',
      shippingAddress: this.shippingAddress.trim(),
      username: this.loggedInUser?.username || undefined,
      productId: this.checkoutProduct.id,
      productName: this.checkoutProduct.name,
      productImage: this.checkoutProduct.image,
      quantity: this.checkoutQuantity,
      unitPrice: this.checkoutProduct.price,
      totalPrice: this.getTotalOrderPrice,
      paymentMethod: this.paymentMethod,
      orderNote: this.orderNote?.trim() || undefined
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (res) => {
        this.orderLoading = false;
        if (res.success && res.data) {
          const methodLabel = this.getPaymentMethodLabel(this.paymentMethod);
          this.orderSuccessMessage = `🎉 Đặt hàng thành công! Mã đơn: #${res.data.id} (${methodLabel}). Đơn hàng "${this.checkoutProduct?.name}" (SL: ${this.checkoutQuantity}) sẽ được giao đến "${this.shippingAddress}" trong vòng 2 giờ!`;

          // Clear cart
          this.cartItems = [];
          this.saveCartToStorage();

          // Refresh orders list
          this.fetchOrdersList();
          this.showToast(`Đã tạo thành công đơn hàng #${res.data.id}!`);

          setTimeout(() => {
            this.closeCheckoutModal();
          }, 3200);
        } else {
          alert('Đặt hàng thất bại: ' + (res.message || 'Lỗi hệ thống'));
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.orderLoading = false;
        alert('Lỗi khi gửi đơn hàng: ' + (err.error?.message || 'Không thể kết nối máy chủ'));
        this.cdr.markForCheck();
      }
    });
  }

  closeAuthModal(): void {
    this.showAuthModal = false;
    this.loginForm = { username: '', password: '' };
    this.registerForm = { fullName: '', phoneNumber: '', address: '', username: '', password: '' };
    this.clearAuthMessages();
    this.cdr.markForCheck();
  }

  clearAuthMessages(): void {
    this.formError = '';
    this.formSuccess = '';
  }

  submitLogin(): void {
    this.formError = '';
    this.formSuccess = '';

    if (!this.loginForm.username.trim() || !this.loginForm.password.trim()) {
      this.formError = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      this.cdr.markForCheck();
      return;
    }

    this.formLoading = true;
    this.cdr.markForCheck();

    this.regService.login(this.loginForm.username.trim(), this.loginForm.password.trim()).subscribe({
      next: (res) => {
        this.formLoading = false;
        if (res.success && res.data) {
          this.saveUserSession(res.data);
          this.closeAuthModal();
        } else {
          this.formError = res.message || 'Tên đăng nhập hoặc mật khẩu không đúng.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.formLoading = false;
        this.formError = err.error?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.';
        this.cdr.markForCheck();
      }
    });
  }

  logoutUser(): void {
    this.loggedInUser = null;
    try {
      localStorage.removeItem('banana_logged_user');
    } catch (e) {}
    this.cdr.markForCheck();
  }

  // Modal Handlers - Register
  openRegisterModal(): void {
    this.openAuthModal('register');
  }

  closeRegisterModal(): void {
    this.closeAuthModal();
  }

  openCustomersModal(): void {
    if (!this.isAdminMode) {
      this.pendingAdminAction = 'customers';
      this.openAdminAuthModal();
      this.adminAuthError = 'Vui lòng nhập mật khẩu Admin (mặc định: admin123) để mở khóa danh sách khách hàng!';
      this.cdr.markForCheck();
      return;
    }
    this.showCustomersModal = true;
    this.fetchCustomersList();
    this.cdr.markForCheck();
  }

  closeCustomersModal(): void {
    this.showCustomersModal = false;
    this.cdr.markForCheck();
  }

  // Submit Registration Form
  submitRegistration(): void {
    this.formError = '';
    this.formSuccess = '';
    this.registeredDataPreview = null;

    if (!this.registerForm.fullName?.trim() ||
        !this.registerForm.phoneNumber?.trim() ||
        !this.registerForm.address?.trim() ||
        !this.registerForm.username?.trim() ||
        !this.registerForm.password?.trim()) {
      this.formError = 'Vui lòng nhập đầy đủ tất cả thông tin.';
      this.cdr.markForCheck();
      return;
    }

    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(this.registerForm.phoneNumber.trim())) {
      this.formError = 'Số điện thoại không hợp lệ (phải gồm 10–11 chữ số).';
      this.cdr.markForCheck();
      return;
    }

    this.formLoading = true;
    this.cdr.markForCheck();

    this.regService.register({
      fullName: this.registerForm.fullName.trim(),
      phoneNumber: this.registerForm.phoneNumber.trim(),
      address: this.registerForm.address.trim(),
      username: this.registerForm.username.trim(),
      password: this.registerForm.password.trim()
    }).subscribe({
      next: (res) => {
        this.formLoading = false;
        if (res.success && res.data) {
          // Lưu phiên đăng nhập tự động khi đăng ký thành công
          this.saveUserSession(res.data);
          this.registerForm = {
            fullName: '',
            phoneNumber: '',
            address: '',
            username: '',
            password: ''
          };
          this.closeRegisterModal();
        } else {
          this.formError = res.message || 'Đăng ký thất bại.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.formLoading = false;
        const msg = err.error?.message || 'Không thể kết nối đến server backend.';
        this.formError = msg;
        this.cdr.markForCheck();
      }
    });
  }

  // Fetch Customers List
  fetchCustomersList(): void {
    this.customersLoading = true;
    this.customersError = '';
    this.cdr.markForCheck();

    this.regService.getRegistrations().subscribe({
      next: (res) => {
        this.customersLoading = false;
        if (res.success && res.data) {
          this.customersList = res.data;
        } else {
          this.customersError = 'Không thể tải danh sách khách hàng.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.customersLoading = false;
        this.customersError = err.error?.message || 'Lỗi khi gọi API lấy danh sách khách hàng.';
        this.cdr.markForCheck();
      }
    });
  }

  get filteredCustomers(): RegistrationUser[] {
    if (!this.customerSearchQuery) return this.customersList;
    const q = this.customerSearchQuery.toLowerCase();
    return this.customersList.filter(c =>
      c.fullName.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q) ||
      c.phoneNumber.includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  }

  // ==========================================
  // ORDER MANAGEMENT (ADMIN)
  // ==========================================
  openOrdersModal(): void {
    if (!this.isAdminMode) {
      this.pendingAdminAction = 'orders';
      this.openAdminAuthModal();
      this.adminAuthError = 'Vui lòng nhập mật khẩu Admin để quản lý đơn hàng!';
      this.cdr.markForCheck();
      return;
    }
    this.showOrdersModal = true;
    this.fetchOrdersList();
    this.cdr.markForCheck();
  }

  closeOrdersModal(): void {
    this.showOrdersModal = false;
    this.selectedOrderForDetail = null;
    this.cdr.markForCheck();
  }

  fetchOrdersList(): void {
    this.ordersLoading = true;
    this.ordersError = '';
    this.cdr.markForCheck();

    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.ordersLoading = false;
        if (res.success && res.data) {
          this.ordersList = res.data;
        } else {
          this.ordersError = res.message || 'Không thể tải danh sách đơn hàng.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.ordersLoading = false;
        this.ordersError = err.error?.message || 'Lỗi khi gọi API đơn hàng.';
        this.cdr.markForCheck();
      }
    });
  }

  updateOrderStatus(order: Order, newStatus: string): void {
    if (!order || order.status === newStatus) return;
    this.updatingOrderId = order.id;
    this.cdr.markForCheck();

    this.orderService.updateStatus(order.id, newStatus).subscribe({
      next: (res) => {
        this.updatingOrderId = null;
        if (res.success && res.data) {
          order.status = res.data.status;
          order.updatedAt = res.data.updatedAt;
          this.showToast(`Đã chuyển đơn "${order.id}" sang: ${this.getStatusLabel(newStatus)}`);
        } else {
          alert('Không thể cập nhật trạng thái: ' + (res.message || 'Lỗi'));
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.updatingOrderId = null;
        alert('Lỗi cập nhật trạng thái đơn hàng: ' + (err.error?.message || 'Lỗi kết nối'));
        this.cdr.markForCheck();
      }
    });
  }

  deleteOrder(order: Order, event?: Event): void {
    if (event) event.stopPropagation();
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng "${order.id}" của khách "${order.customerName}" không?`)) {
      return;
    }

    this.orderService.deleteOrder(order.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.ordersList = this.ordersList.filter(o => o.id !== order.id);
          this.showToast(`Đã xóa đơn hàng "${order.id}" thành công!`);
        } else {
          alert('Không thể xóa đơn hàng: ' + (res.message || 'Lỗi'));
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        alert('Lỗi khi xóa đơn hàng: ' + (err.error?.message || 'Lỗi kết nối'));
        this.cdr.markForCheck();
      }
    });
  }

  selectOrderForDetail(order: Order): void {
    this.selectedOrderForDetail = order;
    this.cdr.markForCheck();
  }

  get filteredOrders(): Order[] {
    let list = this.ordersList;
    if (this.selectedOrderStatusFilter !== 'ALL') {
      list = list.filter(o => o.status === this.selectedOrderStatusFilter);
    }
    if (this.orderSearchQuery?.trim()) {
      const q = this.orderSearchQuery.trim().toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        (o.username && o.username.toLowerCase().includes(q))
      );
    }
    return list;
  }

  get totalOrdersCount(): number {
    return this.ordersList.length;
  }

  get pendingOrdersCount(): number {
    return this.ordersList.filter(o => o.status === 'PENDING').length;
  }

  get confirmedOrdersCount(): number {
    return this.ordersList.filter(o => o.status === 'CONFIRMED').length;
  }

  get shippingOrdersCount(): number {
    return this.ordersList.filter(o => o.status === 'SHIPPING').length;
  }

  get deliveredOrdersCount(): number {
    return this.ordersList.filter(o => o.status === 'DELIVERED').length;
  }

  get cancelledOrdersCount(): number {
    return this.ordersList.filter(o => o.status === 'CANCELLED').length;
  }

  get totalRevenue(): number {
    return this.ordersList
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-badge-pending';
      case 'CONFIRMED': return 'status-badge-confirmed';
      case 'SHIPPING': return 'status-badge-shipping';
      case 'DELIVERED': return 'status-badge-delivered';
      case 'CANCELLED': return 'status-badge-cancelled';
      default: return 'status-badge-default';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'SHIPPING': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao thành công';
      case 'CANCELLED': return 'Đã hủy';
      default: return status || 'Không rõ';
    }
  }

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'MOMO': return 'Ví MoMo';
      case 'VNPAY': return 'VNPay';
      case 'INSTALLMENT': return 'Trả góp 0%';
      default: return 'Tiền mặt (COD)';
    }
  }

  // ==========================================
  // THỐNG KÊ VÀ PHÂN TÍCH (ADMIN ANALYTICS)
  // ==========================================
  openAnalyticsModal(): void {
    if (!this.isAdminMode) {
      this.pendingAdminAction = 'analytics';
      this.openAdminAuthModal();
      this.adminAuthError = 'Vui lòng nhập mật khẩu Admin để xem báo cáo thống kê & phân tích!';
      this.cdr.markForCheck();
      return;
    }
    this.showAnalyticsModal = true;
    this.fetchAnalytics();
    this.cdr.markForCheck();
  }

  closeAnalyticsModal(): void {
    this.showAnalyticsModal = false;
    this.cdr.markForCheck();
  }

  fetchAnalytics(): void {
    this.analyticsLoading = true;
    this.analyticsError = '';
    this.cdr.markForCheck();

    this.analyticsService.getSummary().subscribe({
      next: (res) => {
        this.analyticsLoading = false;
        if (res.success && res.data) {
          this.analyticsData = res.data;
        } else {
          this.analyticsError = res.message || 'Không thể tải báo cáo thống kê.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.analyticsLoading = false;
        this.analyticsError = err.error?.message || 'Lỗi khi gọi API thống kê.';
        this.cdr.markForCheck();
      }
    });
  }

  // ==========================================
  // QUẢN LÝ ĐÁNH GIÁ (ADMIN REVIEWS)
  // ==========================================
  openReviewsModal(): void {
    if (!this.isAdminMode) {
      this.pendingAdminAction = 'reviews';
      this.openAdminAuthModal();
      this.adminAuthError = 'Vui lòng nhập mật khẩu Admin để quản lý đánh giá!';
      this.cdr.markForCheck();
      return;
    }
    this.showReviewsModal = true;
    this.fetchReviewsList();
    this.cdr.markForCheck();
  }

  closeReviewsModal(): void {
    this.showReviewsModal = false;
    this.replyingReviewId = null;
    this.adminReplyText = '';
    this.cdr.markForCheck();
  }

  fetchReviewsList(): void {
    this.reviewsLoading = true;
    this.reviewsError = '';
    this.cdr.markForCheck();

    this.reviewService.getAllReviews().subscribe({
      next: (res) => {
        this.reviewsLoading = false;
        if (res.success && res.data) {
          this.reviewsList = res.data;
        } else {
          this.reviewsError = res.message || 'Không thể tải danh sách đánh giá.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.reviewsLoading = false;
        this.reviewsError = err.error?.message || 'Lỗi khi gọi API đánh giá.';
        this.cdr.markForCheck();
      }
    });
  }

  updateReviewStatus(review: Review, newStatus: string): void {
    if (!review || review.status === newStatus) return;

    this.reviewService.updateStatus(review.id, newStatus).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          review.status = res.data.status;
          this.showToast(`Đã chuyển đánh giá #${review.id} sang: ${newStatus === 'APPROVED' ? 'Đã duyệt' : 'Đã ẩn'}`);
          this.loadProducts();
        } else {
          alert('Không thể cập nhật trạng thái: ' + (res.message || 'Lỗi'));
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        alert('Lỗi khi cập nhật trạng thái đánh giá: ' + (err.error?.message || 'Lỗi kết nối'));
        this.cdr.markForCheck();
      }
    });
  }

  startReplyReview(review: Review): void {
    this.replyingReviewId = review.id;
    this.adminReplyText = review.adminReply || '';
    this.cdr.markForCheck();
  }

  cancelReplyReview(): void {
    this.replyingReviewId = null;
    this.adminReplyText = '';
    this.cdr.markForCheck();
  }

  submitAdminReply(review: Review): void {
    if (!this.adminReplyText?.trim()) {
      alert('Vui lòng nhập nội dung phản hồi!');
      return;
    }

    this.reviewReplyLoading = true;
    this.cdr.markForCheck();

    this.reviewService.replyReview(review.id, this.adminReplyText.trim()).subscribe({
      next: (res) => {
        this.reviewReplyLoading = false;
        if (res.success && res.data) {
          review.adminReply = res.data.adminReply;
          this.replyingReviewId = null;
          this.adminReplyText = '';
          this.showToast(`Đã gửi phản hồi cho khách hàng thành công!`);
        } else {
          alert('Không thể gửi phản hồi: ' + (res.message || 'Lỗi'));
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.reviewReplyLoading = false;
        alert('Lỗi khi gửi phản hồi: ' + (err.error?.message || 'Lỗi kết nối'));
        this.cdr.markForCheck();
      }
    });
  }

  deleteReview(review: Review, event?: Event): void {
    if (event) event.stopPropagation();
    if (!confirm(`Bạn có chắc chắn muốn xóa đánh giá của khách "${review.customerName}" không?`)) {
      return;
    }

    this.reviewService.deleteReview(review.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.reviewsList = this.reviewsList.filter(r => r.id !== review.id);
          this.showToast(`Đã xóa đánh giá thành công!`);
          this.loadProducts();
        } else {
          alert('Không thể xóa đánh giá: ' + (res.message || 'Lỗi'));
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        alert('Lỗi khi xóa đánh giá: ' + (err.error?.message || 'Lỗi kết nối'));
        this.cdr.markForCheck();
      }
    });
  }

  get filteredReviews(): Review[] {
    let list = this.reviewsList;
    if (this.reviewRatingFilter !== 'ALL') {
      const star = Number(this.reviewRatingFilter);
      list = list.filter(r => r.rating === star);
    }
    if (this.reviewStatusFilter !== 'ALL') {
      list = list.filter(r => r.status === this.reviewStatusFilter);
    }
    if (this.reviewSearchQuery?.trim()) {
      const q = this.reviewSearchQuery.trim().toLowerCase();
      list = list.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return list;
  }

  get averageRating(): number {
    if (this.reviewsList.length === 0) return 5.0;
    const avg = this.reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / this.reviewsList.length;
    return Math.round(avg * 10) / 10;
  }

  getStarsArray(rating: number): number[] {
    const stars: number[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 1 : 0);
    }
    return stars;
  }

  // ==========================================
  // PRODUCT DETAIL REVIEWS (CUSTOMER)
  // ==========================================
  loadProductReviews(productId: string): void {
    this.productReviewsLoading = true;
    this.productReviews = [];
    this.submitReviewSuccess = '';
    this.submitReviewError = '';
    this.cdr.markForCheck();

    this.reviewService.getProductReviews(productId).subscribe({
      next: (res) => {
        this.productReviewsLoading = false;
        if (res.success && res.data) {
          this.productReviews = res.data;
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.productReviewsLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  submitProductReview(): void {
    if (!this.selectedDetailProduct) return;

    const authorName = this.loggedInUser?.fullName || this.newReviewName.trim();
    if (!authorName) {
      this.submitReviewError = 'Vui lòng nhập tên của bạn hoặc đăng nhập để đánh giá!';
      this.cdr.markForCheck();
      return;
    }

    if (!this.newReviewComment?.trim()) {
      this.submitReviewError = 'Vui lòng nhập nội dung nhận xét của bạn!';
      this.cdr.markForCheck();
      return;
    }

    this.submitReviewLoading = true;
    this.submitReviewError = '';
    this.submitReviewSuccess = '';
    this.cdr.markForCheck();

    const payload: CreateReviewInput = {
      productId: this.selectedDetailProduct.id,
      productName: this.selectedDetailProduct.name,
      productImage: this.selectedDetailProduct.image,
      customerName: authorName,
      username: this.loggedInUser?.username || undefined,
      rating: this.newReviewRating,
      comment: this.newReviewComment.trim()
    };

    this.reviewService.createReview(payload).subscribe({
      next: (res) => {
        this.submitReviewLoading = false;
        if (res.success && res.data) {
          this.submitReviewSuccess = 'Cảm ơn bạn đã gửi đánh giá! Đánh giá đã được xuất bản.';
          this.productReviews.unshift(res.data);
          this.newReviewComment = '';
          this.newReviewName = '';
          this.showToast('Đã gửi đánh giá sản phẩm thành công!');
          this.loadProducts();
          this.fetchReviewsList();
        } else {
          this.submitReviewError = res.message || 'Gửi đánh giá thất bại.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.submitReviewLoading = false;
        this.submitReviewError = err.error?.message || 'Lỗi kết nối khi gửi đánh giá.';
        this.cdr.markForCheck();
      }
    });
  }

  // ==========================================
  // CUSTOMER ORDER TRACKING & POST-PURCHASE REVIEW
  // ==========================================
  openCustomerOrdersModal(): void {
    this.showCustomerOrdersModal = true;
    this.customerOrdersError = '';
    this.reviewingOrder = null;
    if (this.loggedInUser && this.loggedInUser.username) {
      this.trackingQueryInput = this.loggedInUser.username;
      this.loadMyOrders(this.loggedInUser.username);
    } else if (this.trackingQueryInput?.trim()) {
      this.submitTrackingSearch();
    } else {
      this.customerOrdersList = [];
    }
    this.cdr.markForCheck();
  }

  closeCustomerOrdersModal(): void {
    this.showCustomerOrdersModal = false;
    this.reviewingOrder = null;
    this.orderReviewSuccess = '';
    this.orderReviewError = '';
    this.cdr.markForCheck();
  }

  loadMyOrders(username: string): void {
    this.customerOrdersLoading = true;
    this.customerOrdersError = '';
    this.cdr.markForCheck();

    this.orderService.getMyOrders(username).subscribe({
      next: (res) => {
        this.customerOrdersLoading = false;
        if (res.success && res.data) {
          this.customerOrdersList = res.data;
        } else {
          this.customerOrdersError = res.message || 'Không thể tải lịch sử đơn hàng.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.customerOrdersLoading = false;
        this.customerOrdersError = err.error?.message || 'Lỗi khi kết nối lấy lịch sử đơn hàng.';
        this.cdr.markForCheck();
      }
    });
  }

  submitTrackingSearch(): void {
    const query = this.trackingQueryInput?.trim();
    if (!query) {
      this.customerOrdersError = 'Vui lòng nhập Mã đơn hàng (VD: ORD-...) hoặc Số điện thoại đặt hàng.';
      this.cdr.markForCheck();
      return;
    }

    this.customerOrdersLoading = true;
    this.customerOrdersError = '';
    this.cdr.markForCheck();

    this.orderService.trackOrders(query).subscribe({
      next: (res) => {
        this.customerOrdersLoading = false;
        if (res.success && res.data) {
          this.customerOrdersList = res.data;
        } else {
          this.customerOrdersList = [];
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.customerOrdersLoading = false;
        this.customerOrdersError = err.error?.message || 'Không thể tra cứu đơn hàng.';
        this.cdr.markForCheck();
      }
    });
  }

  customerCancelOrder(order: Order): void {
    if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${order.id} ("${order.productName}") không?`)) {
      return;
    }

    this.cancellingOrderId = order.id;
    this.cdr.markForCheck();

    this.orderService.cancelOrder(order.id).subscribe({
      next: (res) => {
        this.cancellingOrderId = null;
        if (res.success && res.data) {
          order.status = res.data.status;
          this.showToast(`Đã hủy đơn hàng #${order.id} thành công.`);
          this.fetchOrdersList();
        } else {
          alert(res.message || 'Không thể hủy đơn hàng.');
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.cancellingOrderId = null;
        alert(err.error?.message || 'Không thể hủy đơn hàng lúc này.');
        this.cdr.markForCheck();
      }
    });
  }

  openOrderReview(order: Order): void {
    this.reviewingOrder = order;
    this.orderReviewRating = 5;
    this.orderReviewComment = '';
    this.orderReviewSuccess = '';
    this.orderReviewError = '';
    this.cdr.markForCheck();
  }

  closeOrderReview(): void {
    this.reviewingOrder = null;
    this.orderReviewSuccess = '';
    this.orderReviewError = '';
    this.cdr.markForCheck();
  }

  submitOrderReview(): void {
    if (!this.reviewingOrder) return;

    if (!this.orderReviewComment?.trim()) {
      this.orderReviewError = 'Vui lòng nhập nhận xét của bạn về sản phẩm!';
      this.cdr.markForCheck();
      return;
    }

    this.orderReviewSubmitting = true;
    this.orderReviewError = '';
    this.orderReviewSuccess = '';
    this.cdr.markForCheck();

    const payload: CreateReviewInput = {
      productId: this.reviewingOrder.productId,
      productName: this.reviewingOrder.productName,
      productImage: this.reviewingOrder.productImage,
      customerName: this.reviewingOrder.customerName || this.loggedInUser?.fullName || 'Khách hàng',
      username: this.reviewingOrder.username || this.loggedInUser?.username || undefined,
      rating: this.orderReviewRating,
      comment: this.orderReviewComment.trim()
    };

    this.reviewService.createReview(payload).subscribe({
      next: (res) => {
        this.orderReviewSubmitting = false;
        if (res.success && res.data) {
          this.orderReviewSuccess = '🎉 Cảm ơn bạn đã đánh giá! Phản hồi của bạn đã được ghi nhận.';
          this.showToast(`Đã gửi đánh giá ${this.orderReviewRating}⭐ cho "${this.reviewingOrder?.productName}"!`);
          this.loadProducts();
          this.fetchReviewsList();
          setTimeout(() => {
            this.closeOrderReview();
          }, 1800);
        } else {
          this.orderReviewError = res.message || 'Gửi đánh giá thất bại.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.orderReviewSubmitting = false;
        this.orderReviewError = err.error?.message || 'Lỗi kết nối khi gửi đánh giá.';
        this.cdr.markForCheck();
      }
    });
  }

  getOrderStepIndex(status: string): number {
    switch (status) {
      case 'PENDING': return 1;
      case 'CONFIRMED': return 2;
      case 'SHIPPING': return 3;
      case 'DELIVERED': return 4;
      case 'CANCELLED': return -1;
      default: return 1;
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  formatDate(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN');
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleEscapeKey(event: Event): void {
    this.closeAllModals();
  }

  closeAllModals(): void {
    this.showCartModal = false;
    this.showAuthModal = false;
    this.showDetailModal = false;
    this.showCheckoutModal = false;
    this.showAddProductModal = false;
    this.showEditProductModal = false;
    this.showChangePasswordModal = false;
    this.showAdminAuthModal = false;
    this.showCustomersModal = false;
    this.showOrdersModal = false;
    this.showAnalyticsModal = false;
    this.showReviewsModal = false;
    this.showCustomerOrdersModal = false;
    this.reviewingOrder = null;
    this.replyingReviewId = null;
    this.selectedOrderForDetail = null;
    this.selectedDetailProduct = null;
    this.checkoutProduct = null;
    this.cdr.markForCheck();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeAllModals();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.cdr.markForCheck();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedSeries = 'All';
    this.selectedCapacity = 'All';
    this.sortBy = 'featured';
    this.cdr.markForCheck();
  }

  getDetailChip(series: string): string {
    switch (series) {
      case 'Pro': return 'Apple M4 (9/10-core CPU)';
      case 'Air': return 'Apple M2 (8-core CPU)';
      case 'Mini': return 'Apple A17 Pro (6-core CPU)';
      default: return 'Apple A14 Bionic';
    }
  }

  getDetailScreen(series: string): string {
    switch (series) {
      case 'Pro': return 'Ultra Retina XDR Tandem OLED (120Hz)';
      case 'Air': return 'Liquid Retina IPS (True Tone, P3)';
      case 'Mini': return 'Liquid Retina 8.3" (P3)';
      default: return 'Liquid Retina 10.9" (True Tone)';
    }
  }

  getDetailCamera(series: string): string {
    switch (series) {
      case 'Pro': return '12MP Wide 4K + 12MP Ultra Wide Front';
      case 'Air': return '12MP Wide 4K + 12MP Landscape Front';
      case 'Mini': return '12MP Wide 4K + 12MP Ultra Wide Front';
      default: return '12MP Wide 4K + 12MP Ultra Wide Front';
    }
  }
}
