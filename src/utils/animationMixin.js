import Velocity from 'velocity-animate'
export const animationMixin = {
  methods: {
    beforeEnter(el) {
      Velocity(el, {
        translateY: '100px',
        opacity: 0
      }, {
        duration: 0
      })
    },
    beforeEnter2(el) {
      Velocity(el, {
        translateY: '1000px',
        opacity: 0
      }, {
        duration: 0
      })
    },
    enter(el, done) {
      Velocity(el, {
        translateY: '0px',
        opacity: 1
      }, {
        duration: 300
      })
    },
    enter2(el, done) {
      Velocity(el, {
        translateY: '0px',
        opacity: 1
      }, {
        duration: 800
      })
    }
  }
}
