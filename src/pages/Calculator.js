import React from 'react'
import { useForm } from 'react-hook-form'
import { RadioGroup, TextInput } from '../components/FormInputs'
import '../Styles/Kalkulate.css'

function Calculator() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const [activeTaskDetail, setActiveTaskDetail] = React.useState(null)
  const [activePaymentType, setActivePaymentType] = React.useState(null)
  const [activeUrgency, setActiveUrgency] = React.useState(null)

  const onSubmit = data => {
    console.log('Форма отправлена:', data)
  }

  React.useEffect(() => {
    setValue('task_detail', activeTaskDetail)
  }, [activeTaskDetail, setValue])

  React.useEffect(() => {
    setValue('payment_type', activePaymentType)
  }, [activePaymentType, setValue])

  React.useEffect(() => {
    setValue('urgency', activeUrgency)
  }, [activeUrgency, setValue])

  return (
    <form className='main-content' onSubmit={handleSubmit(onSubmit)}>
      <div className='left-section'>
        <div className='category-section'>
          <div className='name-fields'>
            <TextInput
              label='Фамилия'
              name='lastName'
              placeholder='Фамилия'
              register={register}
              errors={errors}
            />
            <TextInput
              label='Имя'
              name='firstName'
              placeholder='Имя'
              register={register}
              errors={errors}
            />
            <TextInput
              label='Отчество'
              name='middleName'
              placeholder='Отчество'
              register={register}
              errors={errors}
            />
          </div>
          <h4>Категории услуг:</h4>
          <RadioGroup
            label='Категория'
            name='category'
            control={control}
            errors={errors}
            options={[
              { label: 'Жилищное право (споры с соседями, управляющими компаниями)', value: 'Жилищное право' },
              { label: 'Защита прав потребителей', value: 'Защита прав потребителей' },
              { label: 'Наследственное право (оформление наследства, споры)', value: 'Наследственное право' },
              { label: 'Семейное право (развод, алименты, раздел имущества)', value: 'Семейное право' },
              { label: 'Взыскание долгов', value: 'Взыскание долгов' },
              { label: 'Уголовное право (защита прав потерпевших и обвиняемых)', value: 'Уголовное право' },
              { label: 'Административное право (обжалование штрафов, защита прав водителей)', value: 'Административное право' },
            ]}
          />
        </div>

        <div className='task-type-section'>
          <h4>Типы задач:</h4>
          <RadioGroup
            label='Тип задачи'
            name='task_type'
            control={control}
            errors={errors}
            options={[
              { label: 'Консультация: (устная, письменная, онлайн, офлайн)', value: 'Консультация' },
              { label: 'Составление документов: (заявления, договоры, иски, жалобы)', value: 'Составление документов' },
              { label: 'Представление интересов: (в суде, государственных органах)', value: 'Представление интересов' },
              { label: 'Юридическая экспертиза: (анализ документов, оценка рисков)', value: 'Юридическая экспертиза' },
              { label: 'Юридический аудит: (комплексная проверка юридической чистоты)', value: 'Юридический аудит' },
            ]}
          />
        </div>

        <div className='task-details'>
          <button
            type='button'
            className={`task-detail-button ${activeTaskDetail === 'Тут' ? 'active' : ''}`}
            onClick={() => {
              setActiveTaskDetail('Тут')
              setValue('task_detail', 'Тут')
            }}
          >
            Тут
          </button>
          <button
            type='button'
            className={`task-detail-button ${activeTaskDetail === 'Разные' ? 'active' : ''}`}
            onClick={() => {
              setActiveTaskDetail('Разные')
              setValue('task_detail', 'Разные')
            }}
          >
            Разные
          </button>
          <button
            type='button'
            className={`task-detail-button ${activeTaskDetail === 'Уточнения' ? 'active' : ''}`}
            onClick={() => {
              setActiveTaskDetail('Уточнения')
              setValue('task_detail', 'Уточнения')
            }}
          >
            Уточнения
          </button>
          <button
            type='button'
            className={`task-detail-button ${activeTaskDetail === 'Типов задач' ? 'active' : ''}`}
            onClick={() => {
              setActiveTaskDetail('Типов задач')
              setValue('task_detail', 'Типов задач')
            }}
          >
            Типов задач
          </button>
        </div>

        <div className='payment-type-section'>
          <h4>Форма оплаты</h4>
          <div className='task-details'>
            <button
              type='button'
              className={`task-detail-button ${activePaymentType === 'Оплата за результат' ? 'active' : ''}`}
              onClick={() => {
                setActivePaymentType('Оплата за результат')
                setValue('payment_type', 'Оплата за результат')
              }}
            >
              Оплата за результат
            </button>
            <button
              type='button'
              className={`task-detail-button ${activePaymentType === 'Почасовая оплата' ? 'active' : ''}`}
              onClick={() => {
                setActivePaymentType('Почасовая оплата')
                setValue('payment_type', 'Почасовая оплата')
              }}
            >
              Почасовая оплата
            </button>
            <button
              type='button'
              className={`task-detail-button ${activePaymentType === 'Абонентское обслуживание' ? 'active' : ''}`}
              onClick={() => {
                setActivePaymentType('Абонентское обслуживание')
                setValue('payment_type', 'Абонентское обслуживание')
              }}
            >
              Абонентское обслуживание
            </button>
          </div>
        </div>

        <div className='urgency-section'>
          <h4>Срочность</h4>
          <div className='task-details'>
            <button
              type='button'
              className={`task-detail-button ${activeUrgency === 'Обычный' ? 'active' : ''}`}
              onClick={() => {
                setActiveUrgency('Обычный')
                setValue('urgency', 'Обычный')
              }}
            >
              Обычный
            </button>
            <button
              type='button'
              className={`task-detail-button ${activeUrgency === 'Срочный' ? 'active' : ''}`}
              onClick={() => {
                setActiveUrgency('Срочный')
                setValue('urgency', 'Срочный')
              }}
            >
              Срочный
            </button>
            <button
              type='button'
              className={`task-detail-button ${activeUrgency === 'Экстренный' ? 'active' : ''}`}
              onClick={() => {
                setActiveUrgency('Экстренный')
                setValue('urgency', 'Экстренный')
              }}
            >
              Экстренный
            </button>
          </div>
        </div>

        <div className='description-section'>
          <h4>Описание услуги:</h4>
          <p>
            Наши юристы разработают для вас договор, учитывающий все особенности
            вашей деятельности и ваши конкретные потребности. Мы тщательно
            продумаем все условия, права и обязанности сторон, ответственность
            за нарушение условий договора и порядок разрешения споров. Мы
            гарантируем, что ваш договор будет соответствовать действующему
            законодательству и максимально защищать ваши интересы.
          </p>
        </div>
      </div>

      <div className='right-section'>
        <div className='account-info'>
          <h4>Текущий счёт</h4>
          <p>№1234567890</p>
          <p>
            Отправить на E-MAIL <img src='' alt=''></img>
          </p>
          <p>
            <span>Категория:</span> {watch('category') || 'не выбрано'}
          </p>
          <p>
            <span>Тип задачи:</span> {watch('task_type') || 'не выбрано'}
          </p>
          <p>
            <span>Модуль:</span> {activeTaskDetail || 'не выбрано'}
          </p>
          <p>
            <span>Срочность:</span> {activeUrgency || 'не выбрано'}
          </p>
          <p>
            <span>Форма оплаты:</span> {activePaymentType || 'не выбрано'}
          </p>
          <p>Итоговая стоимость: {/* TODO: рассчитать стоимость */}</p>
          <button>Оплата</button>
        </div>
      </div>
    </form>
  )
}

export default Calculator
