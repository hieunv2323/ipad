import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistrationService } from './services/registration.service';
import { ProductService } from './services/product.service';
import { ChatbotService } from './services/chatbot.service';
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
    this.cdr.markForCheck();
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedDetailProduct = null;
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

    this.orderLoading = true;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.orderLoading = false;
      const methodLabel = this.paymentMethod === 'MOMO' ? 'Ví Điện Tử MoMo' : this.paymentMethod === 'VNPAY' ? 'VNPay' : this.paymentMethod === 'INSTALLMENT' ? 'Trả góp 0%' : 'Tiền mặt COD';
      this.orderSuccessMessage = `Đặt hàng thành công (${methodLabel})! Đơn hàng "${this.checkoutProduct?.name}" (Số lượng: ${this.checkoutQuantity}) đã được xác nhận và sẽ giao đến "${this.shippingAddress}" trong vòng 2 giờ.`;
      this.cdr.markForCheck();

      setTimeout(() => {
        this.closeCheckoutModal();
      }, 3000);
    }, 800);
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
