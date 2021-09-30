var LangSelector = function() {

    this.$element = null;
    this.$elementMobile = null;

    //
    // Init
    //
    this.init();

};

LangSelector.prototype.init = function() {

    var that = this;

    that.$element = $('#langSelector');

    that.$element.find('a.link_active').click(function(e) {

        e.preventDefault();
        that.changeLanguage($(this).attr('data-lang'));
        return false;

    });

    that.$elementMobile = $('#langSelectorMobile');
    that.$elementMobile.find('a').click(function(e) {

        e.preventDefault();
        that.changeLanguage($(this).attr('data-lang'));
        return false;

    });

};

LangSelector.prototype.changeLanguage = function(lang) {

    $('#language_selector_select').val(lang);
    $('#language_selector_form').submit();

}

module.exports = LangSelector;
