// src/components/MainPage.jsx
import React from 'react'
import '../Styles/PageMain.css'
import SecondPhoto from '../Image/BackSecond.png'
import Firste from '../Image/Firste.png'
import Seconde from '../Image/Seconde.png'
import Therde from '../Image/Therde.png'
import MainIconFirst from '../Image/MainIconFirst.png'
import MainIconSecond from '../Image/MainIconSecond.png'
import MainIconThird from '../Image/MainIconThird.png'
import MainIconFour from '../Image/MainIcoFour.png'

function MainPage() {
	return (
		<div className='PageMain'>
			<main>
				<div className='main_block'>
					<div className='FirstBlock'>
						<div className='FirstTextBlock'>
							<h1>Юридическая компания Nova</h1>
							<p className='text'>
								Мы предоставляем комплексные юридические решения для бизнеса и
								частных лиц, включая корпоративное управление, договорное
								сопровождение, налоговое планирование и защиту интеллектуальной
								собственности. Наша команда опытных юристов разрабатывает
								индивидуальные стратегии, учитывая ваши цели и особенности дела.
								Работаем открыто, прозрачно и всегда на связи. Наша миссия –
								быть вашим надежным партнером, помогая достигать успеха и
								защищать права. Доверьтесь профессионалам – мы решим ваши
								правовые задачи.
							</p>
						</div>
					</div>
					<div className='SecondBlock'>
						<img
							className='SecondPhoto'
							src={SecondPhoto}
							alt='Описание второго изображения'
						></img>
						<div className='SecondTextBlock'>
							<div className='TextBlock'>
								<img className='MiniImage' src={Firste} alt=''></img>
								<p className='text'>
									Мы – юридическая компания, специализирующаяся на поддержке
									предприятий малого и среднего бизнеса, включая государственные
									организации, производственные и строительные компании, а также
									общественные организации.
								</p>
							</div>
							<div className='TextBlock'>
								<img className='MiniImage' src={Seconde} alt=''></img>
								<p className='text'>
									Наша цель – оперативное оказание высокопрофессиональных
									юридических услуг нашим доверителям. Мы ценим ваше время и
									гарантируем быстрое и качественное решение ваших правовых
									вопросов.
								</p>
							</div>
							<div className='TextBlock'>
								<img className='MiniImage' src={Therde} alt=''></img>
								<p className='text'>
									Наша миссия – обеспечение процветания и устойчивого развития
									бизнеса наших клиентов. Мы помогаем выходить из кризисных
									ситуаций, предлагая эффективные и проверенные решения.
								</p>
							</div>
						</div>
					</div>
					<div className='MainContainer'>
						<h2>Причины по которым вы должны обратиться именно к нам</h2>
						<div className='reasons'>
							<div className='reason'>
								<div className='reason__icon'>
									<img src={MainIconFirst} alt=''></img>
								</div>
								<h3 className='reason__title'>Решение</h3>
								<p className='text'>
									Мы решаем даже самые сложные и безнадежные дела, от которых
									отказались другие. Решение есть всегда.
								</p>
							</div>

							<div className='reason'>
								<div className='reason__icon'>
									<img src={MainIconSecond} alt=''></img>
								</div>
								<h3 className='reason__title'>Доступность</h3>
								<p className='text'>
									Доступны 24/7, включая выходные и праздники. Поможем в любое
									время.
								</p>
							</div>

							<div className='reason'>
								<div className='reason__icon'>
									<img src={MainIconThird} alt=''></img>
								</div>
								<h3 className='reason__title'>Наш офис</h3>
								<p className='text'>
									Работаем в Москве: сообщите адрес - наши специалисты приедут к
									вам.
								</p>
							</div>

							<div className='reason'>
								<div className='reason__icon'>
									<img src={MainIconFour} alt=''></img>
								</div>
								<h3 className='reason__title'>Наши обязанности</h3>
								<p className='text'>
									Услуги «под ключ». Мы берем на себя все заботы, чтобы вы могли
									сосредоточиться на главном.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export default MainPage
