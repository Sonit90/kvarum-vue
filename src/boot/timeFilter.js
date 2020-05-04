import { date } from 'quasar'

export default async ({ Vue }) => {
  function formatAgo(value) {
    let date1 = new Date(parseInt(value)* 1000)
    let date2 = new Date()

    let units=['seconds', 'minutes', 'hours', 'days', 'months', 'years']
    let translated=[
      ['секунда', 'секунды', 'секунд'],
      ['минуту', 'минуты', 'минут'],
      ['час', 'часа', 'часов'],
      ['день', 'дня', 'дней'],
      ['месяц', 'месяца', 'месяцев'],
      ['год', 'года','лет']];
    let result=0
    let unit

    units.some((d, index) =>{
      let interval=60
      if(d==='hours'){interval=24}
      if(d==='days'){interval=31}
      if(d==='months'){interval=12}
      if(d==='years'){interval=365}
      if(date.getDateDiff(date2, date1, d)<interval){
        result=parseInt(date.getDateDiff(date2, date1, d))
        unit=Vue.declOfNum(result,translated[index])
        return true
      }
    })
    if(result<0){
      return 'только что'
    }


    return `${result} ${unit}`
  }

  function timeAgoMonth(value) {
    let date1 = new Date(parseInt(value)* 1000)
    let date2 = new Date()

    let units=['seconds', 'minutes', 'hours', 'days']
    let translated=[
      ['секунда', 'секунды', 'секунд'],
      ['минуту', 'минуты', 'минут'],
      ['час', 'часа', 'часов'],
      ['день', 'дня', 'дней']];
    let result=0
    let unit

    units.some((d, index) =>{
      let interval=60
      if(d==='hours'){interval=24}
      if(d==='days'){interval=31}
      if(date.getDateDiff(date2, date1, d)<interval){
        result=parseInt(date.getDateDiff(date2, date1, d))
        unit=Vue.declOfNum(result,translated[index])
        return true
      }else{
        if(d==='days'){
          result=date.formatDate(value * 1000, 'DD MMMM YYYY',
            {
              months: ['Января', 'Февраля','Марта','Апреля','Мая','Июня','Июля', 'Августа', 'Сентября', 'Октября', 'Ноября','Декабря'],
              monthsShort: ['Янв.', 'Фев.','Мар.','Апр.','Мая','Июнь','Июль', 'Авг.', 'Сент.', 'Окт.', 'Нояб.','Дек.']
            })
          unit = 'date'
          return true
        }

      }
    })
    if(unit==='date'){
      return result
    }

    if(result<0){
      return 'только что'
    }


    return `${result} ${unit} назад`
  }



  Vue.filter('toDateTime', function (value) {
    return date.formatDate(value * 1000, 'HH:mm DD-MM-YYYY')
  })
  Vue.filter('toDate', function (value) {
    return date.formatDate(value * 1000, 'DD-MM-YYYY')
  })
  Vue.filter('toTime', function (value) {
    return date.formatDate(value * 1000, 'hh:MM:ss')
  })
  Vue.filter('timeAgo', function (value) {
    let result = formatAgo(value)
    if(result==='только что'){
      return result
    }
    return `${result} назад`
  })
  Vue.filter('timeAgoMonth', function (value) {
    let result = timeAgoMonth(value)
    if(result==='только что'){
      return result
    }
    return result
  })
  Vue.filter('timeAgoRaw', function (value) {
    let result = formatAgo(value)
    if(result<0){
      return 'только что'
    }
    return result
  })


}
