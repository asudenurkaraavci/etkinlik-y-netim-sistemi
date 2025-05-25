document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('kayitSifre').value;
            const sifreTekrar = document.getElementById('sifreTekrar').value;

            if (password !== sifreTekrar) {
                alert('Şifreler uyuşmuyor!');
                return;
            }

            alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
            window.location.href = 'index.html';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sessionStorage.setItem('requirePasswordChange', 'true');
            window.location.href = 'change-password.html';
        });
    }

    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const yeniSifre = document.getElementById('yeniSifre').value;
            const yeniSifreTekrar = document.getElementById('yeniSifreTekrar').value;

            if (yeniSifre !== yeniSifreTekrar) {
                alert('Yeni şifreler uyuşmuyor!');
                return;
            }

            alert('Şifreniz başarıyla değiştirildi. Ana sayfaya yönlendiriliyorsunuz...');
            sessionStorage.removeItem('requirePasswordChange');
            window.location.href = 'home.html';
        });
    }

    const cikisButon = document.getElementById('cikisButon');
    if (cikisButon) {
        cikisButon.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }

    setupAddToCartButtons();

    const odemeyiTamamla = document.getElementById('odemeyiTamamla');
    if (odemeyiTamamla) {
        odemeyiTamamla.addEventListener('click', function() {
            sessionStorage.removeItem('cart');
            alert('Ödeme başarıyla tamamlandı!');
            window.location.href = 'home.html';
        });
    }

    if (document.getElementById('sepetElemanlari')) {
        displaysepetElemanlari();
    }
});

function setupAddToCartButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
            addToCart(e.target);
        }

        if (e.target.classList.contains('remove-item')) {
            e.preventDefault();
            removeFromCart(e.target);
        }
    });
}

function addToCart(button) {
    try {
        const eventId = button.getAttribute('data-id');
        const eventCard = button.closest('.etkinlik-kart');

        if (!eventCard) {
            throw new Error('Etkinlik kartı bulunamadı');
        }

        const eventName = eventCard.querySelector('h3').textContent;
        const eventDate = eventCard.querySelector('p:nth-of-type(1)').textContent;
        const eventLocation = eventCard.querySelector('p:nth-of-type(2)').textContent;

        const event = {
            id: eventId,
            name: eventName,
            date: eventDate,
            location: eventLocation,
            price: 100
        };

        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        cart.push(event);
        sessionStorage.setItem('cart', JSON.stringify(cart));

        alert('Etkinlik sepete eklendi!');

        if (document.getElementById('sepetElemanlari')) {
            displaysepetElemanlari();
        }
    } catch (error) {
        console.error('Sepete ekleme hatası:', error);
        alert('Sepete eklerken bir hata oluştu: ' + error.message);
    }
}

function removeFromCart(button) {
    const itemId = button.getAttribute('data-id');
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    displaysepetElemanlari();
}

function displaysepetElemanlari() {
    const sepetElemanlariContainer = document.getElementById('sepetElemanlari');
    const totalAmountElement = document.getElementById('toplamTutar');

    let cart = [];
    try {
        cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    } catch (e) {
        console.error('Sepet verisi okunamadı:', e);
    }

    sepetElemanlariContainer.innerHTML = '';

    if (cart.length === 0) {
        sepetElemanlariContainer.innerHTML = '<p>Sepetiniz boş.</p>';
        toplamTutarElement.textContent = '0';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>${item.date}</p>
                <p>${item.location}</p>
                <p>${item.price} TL</p>
            </div>
            <button class="buton remove-item" data-id="${item.id}">Kaldır</button>
        `;

        sepetElemanlariContainer.appendChild(itemElement);
    });

    totalAmountElement.textContent = total;
}