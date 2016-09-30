var Input = (function() {

    function InputComponent(controlled)
    {
        this._controlled = controlled;
    }

    InputComponent.prototype.constructor = InputComponent;
    InputComponent.prototype.update = function()
    {

    };

    return {
        InputComponent: InputComponent
    };

})();

module.exports = Input;
