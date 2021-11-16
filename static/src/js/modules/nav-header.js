var NavHeader = function() {

    this.element = document.getElementById('navHeader');
    console.log()
    this.elements = this.element.getElementsByClassName('nav-header__item');

    //
    // Init
    //
    this.init();

};

NavHeader.prototype.init = function() {

    var that = this;

    for (var e in this.elements) {
        if (typeof this.elements[e] === "object") {
            (function(){
                var elem = e;
                var submenus = that.elements[elem].getElementsByClassName('nav-header__submenu');
                if(submenus.length > 0){
                    var submenu = submenus[0]
                    var submenuHover = false
                    submenu.addEventListener("mouseover", function(){
                        submenuHover = true
                    })
                    that.elements[elem].addEventListener("mouseover", function(){
                        that.elements[elem].classList.add("hover")
                        submenu.classList.add("visible")
                        submenuHover = false
                    })
                    that.elements[elem].addEventListener("mouseout", function(){
                        if (!submenuHover) {
                            that.elements[elem].classList.remove("hover")
                            submenu.classList.remove("visible")
                        }
                        submenuHover = false
                    })
                }
            })()
        }
    }

};

module.exports = NavHeader;
