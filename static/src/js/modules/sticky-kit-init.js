var StickyKitInit = function() {

    //
    // Init
    //
    this.init();

};

StickyKitInit.prototype.init = function() {

    var sidebar = document.getElementsByClassName("page__sidebar")
    var content = document.getElementsByClassName("sidebar_content")
    var position = "absolute"
    if(sidebar.length > 0 && content.length > 0){
        sidebar = sidebar[0]
        content = content[0]
        var sliders = content.getElementsByClassName("page__slider")
        document.addEventListener("scroll", function(){
            if(window.innerWidth >= 972){

                var sidebar_rect = sidebar.getBoundingClientRect()
                var content_rect = content.getBoundingClientRect()
                if(content_rect.top < 100){
                    var dist = Math.round(content_rect.bottom - sidebar_rect.bottom)
                    if(
                        (
                            Math.round(content_rect.bottom - sidebar_rect.bottom) > 10
                        ) || (
                            sidebar_rect.top > 100 && dist > -5 && dist < 5
                        )
                    ){
                        position = "fixed"
                        sidebar.style.position = position
                        sidebar.style.top = "100px"
                    }else{
                        position = "absolute"
                        sidebar.style.position = position
                        sidebar.style.top = (window.scrollY + content_rect.bottom - sidebar.clientHeight) + "px"
                    }
                }else{
                    position = "absolute"
                    sidebar.style.position = position
                    sidebar.style.top = "auto"
                }
                for(var s in sliders){
                    if(typeof sliders[s] == "object"){
                        var rect = sliders[s].getBoundingClientRect()
                        if(
                            (
                                sidebar_rect.bottom - rect.top > 0 &&
                                sidebar_rect.bottom - rect.bottom < 0
                            ) || (
                                sidebar_rect.top - rect.top > 0 &&
                                sidebar_rect.top - rect.bottom < 0
                            ) || (
                                sidebar_rect.top < rect.top &&
                                sidebar_rect.bottom > rect.bottom
                            )
                        ){
                            sidebar.querySelector("ul").classList.add("faded")
                        }else{
                            sidebar.querySelector("ul").classList.remove("faded")
                        }
                    }
                }
            }
        })
        window.addEventListener("resize", function(){
            if(window.innerWidth < 972){
                sidebar.style.position = "static"
            }else{
                sidebar.style.position = position
                document.body.classList.remove("pushy-open-left")
            }
        })
    }

};

module.exports = StickyKitInit;
