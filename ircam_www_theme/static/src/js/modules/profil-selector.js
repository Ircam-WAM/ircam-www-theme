var ProfilSelector = function() {

    this.$element = null;
    this.$elementMobile = null;

    //
    // Init
    //
    this.init();

};

ProfilSelector.prototype.init = function() {

    var that = this;


    // Desktop profil selector
    that.$element = document.querySelector('.profilSelector:last-of-type');
    that.$element.addEventListener("click", function(e) {

        that.$element = $(that.$element)

        if ($(this).hasClass('unclickable')) {
            e.preventDefault();
        }

        that.$element.toggleClass('open');
        if(that.$element.hasClass('open')) {
            that.$element.one('mouseleave', function() {
                that.$element.removeClass('open');
            })
        }

    });

    // Mobile profil selector
    that.$mobElement = document.querySelector('.profilSelector:first-of-type');
    that.$mobElement.addEventListener("click", function(e) {

        that.$mobElement = $(that.$mobElement)

        if ($(this).hasClass('unclickable')) {
            e.preventDefault();
        }

        that.$mobElement.toggleClass('open');
        if(that.$mobElement.hasClass('open')) {
            that.$mobElement.one('mouseleave', function() {
                that.$mobElement.removeClass('open');
            })
        }

    });


    that.$elementMobile = $('#ProfilSelectorMobile');
    that.$elementMobile.find('a').click(function(e) {

        e.preventDefault();
        return false;

    });

};


module.exports = ProfilSelector;
