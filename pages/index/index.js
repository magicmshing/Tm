//index.js

// 映射动态天气对应的中文天气
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
// 设置动态导航栏颜色
const weatherColorMap = {
  'sunny': 'c0dcff',
  'cloudy': 'bcdfec',
  'overcast': 'c0dcff',
  'lightrain': 'd6d4fb',
  'heavyrain': 'bcbae5',
  'snow': 'e2eef2'
}
const QQMapWX = require(
  '../../libs/qqmap-wx-jssdk.js'
  )



Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '',  //     动态获取与天气相对应的背景图片
    hourlyWeather: [],
    todayTemp: "",
    todayDate: "",
  },
  enablePullDownRefresh() {
    this.getnow(() => {
      wx.stopPullDownRefresh()
    })
  },
  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: 'IC7BZ-J3SW4-YMDU7-D6LQU-3O7QJ-NZFY6'
    })
    this.getnow()
  },
  getnow(callback) {
    wx.request({
      url: 'http://test-miniprogram.com/api/weather/now',
      data: {
        city: '广州市'
      },
      success: res => {
         console.log(res)
         let result = res.data.result
         this.setnow(result)
         this.sethourlyWeather(result)
         this.setToday(result)         
       },
       complete:() => {
         callback && callback()
       }
     })         
  },
  setnow(result){
    let temp = result.now.temp
    let weather = result.now.weather
    console.log(temp, weather)
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather]
    })
  },
  sethourlyWeather(result){
    let forecast = result.forecast
    let nowHour = new Date().getHours()
    let hourlyWeather = []
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°',
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  setToday(result){
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
  onTapDayWeather(){
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },
  onTapLocation() {
    wx.getLocation({
      success: rse => {
        // this.qqmapsdk.reverseGeocoder({
        //   location: {
        //     latitude: 39.984060,
        //     longitude: 116.307520
        //   },
        //   success: res => {
        //     console.log(res.result.address_component.city);
        //   }
        // });
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: rse.latitude,
            longitude: rse.longitude
          },
          success: res => {
            console.log(res.result.address_component.city);
          }
        });
      }
    })
  }
})
