import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistrationService } from './services/registration.service';
import { ProductService } from './services/product.service';
import { Product, RegistrationInput, RegistrationUser, CreateProductInput } from './models/registration.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'Banana iPad Store';

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

  // Modals state
  showAddProductModal: boolean = false;
  showEditProductModal: boolean = false;
  showRegisterModal: boolean = false;
  showCustomersModal: boolean = false;
  showLoginModal: boolean = false;

  // Login / Session State
  currentUser: import('./models/registration.model').RegistrationUser | null = null;
  loginUsername: string = '';
  loginPassword: string = '';
  loginLoading: boolean = false;
  loginError: string = '';

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

  constructor(
    private regService: RegistrationService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
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
      return;
    }

    if (this.adminPasswordInput === this.getAdminPassword()) {
      this.isAdminMode = true;
      this.closeAdminAuthModal();
    } else {
      this.adminAuthError = 'Mật khẩu quản trị không đúng! Vui lòng thử lại.';
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
      const matchSeries = this.selectedSeries === 'All' || p.series === this.selectedSeries;
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
    this.showAddProductModal = true;
    this.addProductError = '';
    this.addProductSuccess = '';
  }

  closeAddProductModal(): void {
    this.showAddProductModal = false;
  }

  selectSampleImage(url: string): void {
    this.addProductForm.image = url;
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
      this.addProductError = 'Vui lòng nhập đầy đủ tên, dòng máy, dung lượng, màu sắc và link hình ảnh.';
      return;
    }

    if (!this.addProductForm.price || this.addProductForm.price <= 0) {
      this.addProductError = 'Giá bán phải lớn hơn 0.';
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
          this.products.unshift(res.data);
          
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
            this.cdr.markForCheck();
          }, 1000);
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
  }

  closeEditProductModal(): void {
    this.showEditProductModal = false;
    this.editingProductId = null;
  }

  selectSampleImageForEdit(url: string): void {
    this.editProductForm.image = url;
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
      return;
    }

    if (!this.editProductForm.price || this.editProductForm.price <= 0) {
      this.editProductError = 'Giá bán phải lớn hơn 0.';
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
          }

          setTimeout(() => {
            this.closeEditProductModal();
            this.cdr.markForCheck();
          }, 1000);
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
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}" khỏi cửa hàng không?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.products = this.products.filter(p => p.id !== product.id);
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

  // Modal Handlers - Login
  openLoginModal(): void {
    this.showLoginModal = true;
    this.loginUsername = '';
    this.loginPassword = '';
    this.loginError = '';
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
    this.loginError = '';
  }

  submitLogin(): void {
    this.loginError = '';
    if (!this.loginUsername.trim() || !this.loginPassword.trim()) {
      this.loginError = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      return;
    }
    this.loginLoading = true;
    this.cdr.markForCheck();

    this.regService.login(this.loginUsername.trim(), this.loginPassword.trim()).subscribe({
      next: (res) => {
        this.loginLoading = false;
        if (res.success && res.data) {
          this.currentUser = res.data;
          this.closeLoginModal();
        } else {
          this.loginError = res.message || 'Tên đăng nhập hoặc mật khẩu không đúng.';
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loginLoading = false;
        this.loginError = err.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        this.cdr.markForCheck();
      }
    });
  }

  logoutUser(): void {
    this.currentUser = null;
    this.cdr.markForCheck();
  }

  // Modal Handlers - Register
  openRegisterModal(): void {
    this.showRegisterModal = true;
    this.formError = '';
    this.formSuccess = '';
    this.registeredDataPreview = null;
  }

  closeRegisterModal(): void {
    this.showRegisterModal = false;
  }

  openCustomersModal(): void {
    this.showCustomersModal = true;
    this.fetchCustomersList();
  }

  closeCustomersModal(): void {
    this.showCustomersModal = false;
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
          // Đóng modal và về trang chính ngay lập tức
          this.closeRegisterModal();
          this.formSuccess = '';
          this.cdr.markForCheck();
        } else {
          this.formError = res.message || 'Đăng ký thất bại.';
          this.cdr.markForCheck();
        }
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
}
