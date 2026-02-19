/* eslint-disable */
(function(factory) {
  if (typeof exports === "object") {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function($) {
  return {
    isDesktop: _is("desktop"),
    isPhone: _is("phone"),
    getType
  };

  function _is(TYPE) {
    return function() {
      return getType() === TYPE;
    };
  }
  function getType() {
    /* var constants = {
      '#ffffff': 'desktop',
      'rgb(255, 255, 255)': 'desktop',
      '#000000': 'phone',
      'rgb(0, 0, 0)': 'phone'
    }; */
    const constants = [
      {
        type: "desktop",
        test: test("#ffffff")
      },
      {
        type: "phone",
        test: test("#000000")
      }
    ];

    const _value = getValue($(".is-desktop"));
    for (let i = 0; i < constants.length; i++) {
      if (doTest(constants[i].test, _value)) {
        return constants[i].type;
      }
    }

    return undefined;

    function getValue($element) {
      return $($element)
        .css("background-color")
        .toLowerCase();
    }

    function doTest(test, val, _default) {
      if (!test) return _default;

      switch (typeof test) {
        case "boolean":
        case "number":
        case "string":
          return test === val;

        case "function":
          return test(val);

        default:
          if (typeof test.test === "function") {
            // Регулярные выражения попадают сюда
            // return doTest(test.test, val, _default);
            return test.test(val);
          }
          break;
      }

      return test === val;
    }

    function test(val) {
      // /^(#ffffff|rgb\(255\s*,\s*255\s*,\s*255\))$/i
      // /^(#000000|rgb\(0\s*,\s*0\s*,\s*0\))$/i

      const r = parseInt(val.substr(1, 2), 16);
      const g = parseInt(val.substr(3, 2), 16);
      const b = parseInt(val.substr(5, 2), 16);

      return new RegExp(
        `^(${val}|rgb\\(\\s*${[r, g, b].join("\\s*,\\s*")}\\s*\\))$`
      );
    }
  }
});
