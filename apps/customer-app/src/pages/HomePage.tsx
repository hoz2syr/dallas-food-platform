import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "سلطة السيزر بالدجاج المشوي",
    description: "خس روماني، دجاج مشوي، كروتون، جبنة بارميزان، صلصة سيزر خاصة",
    price: "65",
    category: "appetizers",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    name: "برغر اللحم البقري الفاخر",
    description: "لحم بقري عالي الجودة، جبنة شيدر، بصل كاراميل، خس، طماطم، صلصة خاصة",
    price: "95",
    category: "main",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    name: "شريحة لحم أنغوس",
    description: "شريحة لحم أنغوس عالية الجودة (250 جم)، مشوية مع صلصة الفلفل الأسود وخضروات مشوية",
    price: "220",
    category: "main",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 4,
    name: "تشيز كيك بالتوت",
    description: "تشيز كيك كريمي مع طبقة من صلصة التوت الطازج، تقدم مع كريمة خفق طازجة",
    price: "55",
    category: "desserts",
    image: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 5,
    name: "مشروبات الفواكه الطازجة",
    description: "عصير برتقال، فراولة، أناناس، مانجو طازج بدون إضافات صناعية",
    price: "25",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1623063531325-8a5d1670a4e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 6,
    name: "سلمون مشوي مع صلصة الليمون",
    description: "شرائح السلمون الطازج المشوي مع صلصة الليمون والأعشاب، تقدم مع أرز بسمتي وخضروات",
    price: "180",
    category: "main",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 7,
    name: "مقبلات المأكولات البحرية",
    description: "خليط من الجمبري، الكالاماري، والمحار المقلي مع صلصة التارتار والثوم",
    price: "120",
    category: "appetizers",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 8,
    name: "قهوة إسبريسو إيطالية",
    description: "قهوة إسبريسو إيطالية أصلية، محضرة من حبوب البن المختارة بعناية",
    price: "20",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);

  useEffect(() => {
    filterMenuItems('all');
  }, []);

  const filterMenuItems = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === category));
    }
  };

  const orderItem = (itemId: number) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
      const message = `أريد طلب: ${item.name} - السعر: ${item.price} ج.م`;
      const whatsappUrl = `https://wa.me/201092888626?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const guests = formData.get('guests') as string;
    const occasion = formData.get('occasion') as string;
    const message = formData.get('message') as string;

    const bookingMessage = `حجز طاولة جديدة%0A%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0Aالتاريخ: ${date}%0Aالوقت: ${time}%0Aعدد الأشخاص: ${guests}%0Aالمناسبة: ${occasion || 'لا توجد'}%0Aملاحظات: ${message || 'لا توجد'}`;

    const whatsappUrl = `https://wa.me/201092888626?text=${bookingMessage}`;
    window.open(whatsappUrl, '_blank');

    e.currentTarget.reset();
    alert('سيتم تحويلك لتطبيق واتساب لإتمام عملية الحجز. شكراً لك!');
  };

  return (
    <div className="home-page">
      {/* شريط التنقل */}
      <header>
        <div className="container">
          <nav>
            <a href="#" className="logo">WEB<span>STAMP</span> PRO</a>
            <ul className="nav-links">
              <li><a href="#home">الرئيسية</a></li>
              <li><a href="#menu">قائمة الطعام</a></li>
              <li><a href="#about">من نحن</a></li>
              <li><a href="#contact">اتصل بنا</a></li>
              <li><a href="#reservation">الحجوزات</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* القسم الرئيسي */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>مطعم WEB STAMP PRO</h1>
            <p>نقدم لكم ألذ الأطباق العالمية بلمسة عصرية في أجواء راقية تليق بأذواقكم الرفيعة. خبرتنا تمتد لأكثر من 15 عاماً في عالم الطهي الاحترافي.</p>
            <a href="#menu" className="btn">استعرض قائمة الطعام</a>
            <a href="#reservation" className="btn btn-secondary">احجز طاولتك الآن</a>
          </div>
        </div>
      </section>

      {/* قسم المنيو */}
      <section id="menu" className="menu">
        <div className="container">
          <div className="section-title">
            <h2>قائمة الطعام</h2>
            <p>استمتع بأشهى الأطباق المحضرة بأيدي أمهر الطهاة</p>
          </div>

          <div className="menu-categories">
            <button
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => filterMenuItems('all')}
            >
              الكل
            </button>
            <button
              className={`category-btn ${activeCategory === 'appetizers' ? 'active' : ''}`}
              onClick={() => filterMenuItems('appetizers')}
            >
              المقبلات
            </button>
            <button
              className={`category-btn ${activeCategory === 'main' ? 'active' : ''}`}
              onClick={() => filterMenuItems('main')}
            >
              الوجبات الرئيسية
            </button>
            <button
              className={`category-btn ${activeCategory === 'desserts' ? 'active' : ''}`}
              onClick={() => filterMenuItems('desserts')}
            >
              الحلويات
            </button>
            <button
              className={`category-btn ${activeCategory === 'drinks' ? 'active' : ''}`}
              onClick={() => filterMenuItems('drinks')}
            >
              المشروبات
            </button>
          </div>

          <div className="menu-items">
            {filteredItems.map((item) => (
              <div key={item.id} className="menu-item">
                <div
                  className="menu-item-img"
                  style={{ backgroundImage: `url('${item.image}')` }}
                ></div>
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h3 className="menu-item-title">{item.name}</h3>
                    <span className="menu-item-price">{item.price} ج.م</span>
                  </div>
                  <p className="menu-item-desc">{item.description}</p>
                  <button className="btn" onClick={() => orderItem(item.id)}>اطلب الآن</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الاتصال */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-title">
            <h2>اتصل بنا</h2>
            <p>نحن هنا لخدمتكم في أي وقت</p>
          </div>

          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h3>اتصل بنا</h3>
              <p>هاتف: 01092888626</p>
              <p>هاتف: 0223456789</p>
              <a href="https://wa.me/201092888626" className="whatsapp-btn" target="_blank" rel="noopener">
                <i className="fab fa-whatsapp"></i> تواصل عبر واتساب
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>موقعنا</h3>
              <p>123 شارع المطاعم، المنطقة الراقية</p>
              <p>القاهرة، مصر</p>
              <a href="https://maps.google.com/?q=القاهرة+مصر" className="btn" target="_blank" rel="noopener">عرض على الخريطة</a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>ساعات العمل</h3>
              <p>السبت - الخميس: 10 صباحاً - 12 منتصف الليل</p>
              <p>الجمعة: 2 ظهراً - 12 منتصف الليل</p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الحجوزات */}
      <section id="reservation" className="reservation">
        <div className="container">
          <div className="section-title">
            <h2>احجز طاولتك</h2>
            <p>احجز طاولتك الآن واستمتع بتجربة طعام لا تنسى</p>
          </div>

          <div className="reservation-form">
            <form id="bookingForm" onSubmit={handleBookingSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">الاسم الكامل</label>
                  <input type="text" id="name" name="name" className="form-control" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">رقم الهاتف</label>
                  <input type="tel" id="phone" name="phone" className="form-control" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">التاريخ</label>
                  <input type="date" id="date" name="date" className="form-control" required />
                </div>
                <div className="form-group">
                  <label htmlFor="time">الوقت</label>
                  <input type="time" id="time" name="time" className="form-control" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="guests">عدد الأشخاص</label>
                  <select id="guests" name="guests" className="form-control" required>
                    <option value="1">1 شخص</option>
                    <option value="2">2 أشخاص</option>
                    <option value="3">3 أشخاص</option>
                    <option value="4">4 أشخاص</option>
                    <option value="5">5 أشخاص</option>
                    <option value="6">6+ أشخاص</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="occasion">المناسبة (اختياري)</label>
                  <input type="text" id="occasion" name="occasion" className="form-control" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">ملاحظات إضافية (اختياري)</label>
                <textarea id="message" name="message" className="form-control" rows={4}></textarea>
              </div>

              <button type="submit" className="btn" style={{ width: '100%', fontSize: '20px', padding: '15px' }}>تأكيد الحجز</button>
            </form>
          </div>
        </div>
      </section>

      {/* تذييل الصفحة */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-about">
              <div className="footer-logo">WEB<span>STAMP</span> PRO</div>
              <p>نحن مطعم يقدم أشهى المأكولات العالمية في أجواء راقية وأنيقة. نحرص على تقديم أفضل خدمة لعملائنا باستخدام أجود المكونات وأحدث طرق الطهي.</p>
              <div className="social-links">
                <a href="#" className="btn" style={{ margin: '5px', padding: '8px 15px' }}><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="btn" style={{ margin: '5px', padding: '8px 15px' }}><i className="fab fa-instagram"></i></a>
                <a href="#" className="btn" style={{ margin: '5px', padding: '8px 15px' }}><i className="fab fa-twitter"></i></a>
              </div>
            </div>

            <div className="footer-links">
              <h4>روابط سريعة</h4>
              <ul>
                <li><a href="#home">الرئيسية</a></li>
                <li><a href="#menu">قائمة الطعام</a></li>
                <li><a href="#about">من نحن</a></li>
                <li><a href="#contact">اتصل بنا</a></li>
                <li><a href="#reservation">الحجوزات</a></li>
              </ul>
            </div>

            <div className="footer-hours">
              <h4>ساعات العمل</h4>
              <div className="hours-list">
                <p>السبت - الخميس <span>10:00 ص - 12:00 ص</span></p>
                <p>الجمعة <span>2:00 م - 12:00 ص</span></p>
                <p>العطلات الرسمية <span>مفتوح</span></p>
              </div>
            </div>
          </div>

          <div className="copyright">
            <p>جميع الحقوق محفوظة &copy; 2023 مطعم WEB STAMP PRO</p>
            <p>تصميم وبرمجة: فريق Web Stamp Pro</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
