module.exports = function (App) {
  const { KLNode, KLError } = require('@kumologica/devkit');

  class WeatherByCityError extends KLError { }

  class WeatherByCity extends KLNode {
    constructor(props) {
      super(App, props);
      this.city = props.city;

      // Method bindings
      this.handle = this.handle.bind(this);
    }

    async handle(msg) {
      let City = App.util.evaluateDynamicField(this.city, msg, this);
      

      let Query = {};
      Query.q = City;
      Query.appId = '77e4b0e970ae0436b5da1205c45a8f01'


      try {
        const options = {
          headers: {
            "Content-Type": 'application/json',
          },
          url: `https://api.openweathermap.org/data/2.5/weather?`,
          method: 'GET',
          responseType: 'json',
          query: Query
        };
        let response = await this.http(options);
        if (response.statusCode === 202) {
          msg.header.weather = {};
          msg.payload = response.body;
          msg.header.weather.statuscode = response.statusCode;
          this.send(msg)
          return
        } else {
          let err={}
          err.message = response.body;
          err.statuscode = response.statusCode
          this.sendError(new WeatherByCityError(JSON.stringify(err)), msg)
          return;
        }
      } catch (error) {
        this.sendError(new WeatherByCityError(error), msg)
        return;
      }
    }
  }
  App.nodes.registerType('WeatherByCity', WeatherByCity);
};
