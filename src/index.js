const {
  sel,
  box: _flat_box,
} = require('reactive-box');

const

  def_prop = Object.defineProperty,

  def_box_prop = (o, p, init) => (
    (init = _flat_box(init && init())),
    def_prop(o, p, { get: init[0], set: init[1] })
  ),

  prop = (_target, key, descriptor) => (
    (_target = descriptor && descriptor.initializer), ({
      get() {
        def_box_prop(this, key, _target && _target.bind(this));
        return this[key];
      },
      set(value) {
        def_box_prop(this, key, _target && _target.bind(this));
        this[key] = value;
      },
    })
  ),

  cache = (_target, key, descriptor) => ({
    get() {
      const [get] = sel(descriptor.get);
      def_prop(this, key, { get });
      return this[key];
    }
  })
;


module.exports = {
  prop, cache
};
