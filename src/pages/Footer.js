// src/components/Footer.jsx
import React from 'react'
import logo from '../Image/logo.png'
import Vk from '../Image/Vk.png'
import Tg from '../Image/Tg.png'
import '../Styles/footer.css'

function Footer() {
	return (
		<footer className='footer'>
			<div className='footer-container'>
				<div className='midle_column'>
					<div className='logo'>
						<img src={logo} alt='Nova Logo'></img>
						<p className='textLogo'>Nova</p>
					</div>
					<p>Юридическая фирма</p>
				</div>

				<div className='small_column'>
					<ul className='footer-links'>
						<li>
							<a href='https://github.com/pixtu376/Labs'>
								<p>О компании</p>
							</a>
						</li>
						<li>
							<a href='https://github.com/pixtu376/Labs'>
								<p>Услуги</p>
							</a>
						</li>
						<li>
							<a href='https://github.com/pixtu376/Labs'>
								<p>Цены</p>
							</a>
						</li>
						<li>
							<a href='https://github.com/pixtu376/Labs'>
								<p>Контакты</p>
							</a>
						</li>
					</ul>
				</div>

				<div className='column'>
					<div className='contact-info'>
						<div>
							<p>E-mail: NeObman@gmail.com</p>
						</div>
						<div>
							<img src={Vk} alt='VK'></img>
							<p>Мы во Вконтакте</p>
						</div>
						<div>
							<img src={Tg} alt='Telegram'></img>
							<p>Мы в Телеграме</p>
						</div>
					</div>
				</div>

				<div className='midle_column'>
					<div className='phone-numbers'>
						<p>+7 800 555 35 35</p>
						<p>Номер по Москве</p>
						<p>+7 800 555 36 52</p>
						<p>Позвонить в офисы</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
