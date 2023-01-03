const Slider = require('../../model/Slider');

class SliderController {
    show(req, res, next) {
        Slider.find({})
            .lean()
            .then((slider) => console.log(slider))
            .catch(next);
    }
}

module.exports = new SliderController();
