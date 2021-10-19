// features/support/world.js
const { setWorldConstructor } = require("@cucumber/cucumber");

class CustomWorld {
  constructor() {
    this.response = '';
    this.profile = '';
    this.region = '';
  }

  setResponse(r) {
    this.response = r;
  }

  setProfile(p) {
    this.profile = p;
  }

  setRegion(r) {
    this.region = r;
  }
}

setWorldConstructor(CustomWorld);
