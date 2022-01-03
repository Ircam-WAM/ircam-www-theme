var StickyKitInit = function() {

    //
    // Init
    //
    this.init();

};

StickyKitInit.prototype.init = function() {

    var topNavBarSpaceDefault = 100 //px

    var sidebar = document.getElementsByClassName("page__sidebar")
    var content = document.getElementsByClassName("sidebar_content")
    var position = "absolute"
    if(sidebar.length > 0 && content.length > 0){
        sidebar = sidebar[0]
        content = content[0]
        var start_sidebar = null
        var starts = document.getElementsByClassName("navbar-start")
        var start_min = null
        for(var s in starts){
            if(typeof starts[s] == "object"){
                var top = starts[s].getBoundingClientRect().top
                if(start_min == null || top < start_min){
                    start_min = top
                    start_sidebar = starts[s]
                }
            }
        }
        var end_sidebar = null
        var ends = document.getElementsByClassName("navbar-end")
        var end_max = null
        for(var e in ends){
            if(typeof ends[e] == "object"){
                var top = ends[e].getBoundingClientRect().top
                if(end_max == null || top > end_max){
                    end_max = top
                    end_sidebar = ends[e]
                }
            }
        }
        // var ends = document.getElementsByClassName("navbar-end")
        // var end_sidebar = ends[ends.length - 1]  // last navbar-end div is used
        var sliders = document.getElementsByClassName("page__slider")
        var topPosition = "auto"
        setTimeout(function(){
            handleScroll()
        }, 30)

        function handleScroll(){

            var diff = window.innerHeight - sidebar.clientHeight
            var topNavBarSpace = topNavBarSpaceDefault
            var scrollable = document.querySelector('.page__sidebar > div')
            if(diff >= 5 && diff < topNavBarSpaceDefault){
                topNavBarSpace = diff
                scrollable.style.overflow = 'auto'
                scrollable.style.maxHeight = "auto"
            }else if(diff < 5){
                topNavBarSpace = 5
                scrollable.style.overflow = 'scroll'
                scrollable.style.maxHeight = "calc(100vh - 5px)"
            }else{
                scrollable.style.overflow = 'auto'
                scrollable.style.maxHeight = "auto"
            }

            if(start_sidebar){
                topPosition = (start_sidebar.getBoundingClientRect().top + window.scrollY) + 'px'
            }
            if(window.innerWidth >= 972){

                var sidebar_rect = sidebar.getBoundingClientRect()
                var content_rect = content.getBoundingClientRect()
                var start = null
                if (start_sidebar) {
                    start = start_sidebar.getBoundingClientRect().top
                }else{
                    start = content_rect.top
                }
                var end = null
                if (end_sidebar) {
                    end = end_sidebar.getBoundingClientRect().bottom
                }else{
                    end = content_rect.bottom
                }

                if(start < topNavBarSpace){
                    var dist = Math.round(end - sidebar_rect.bottom)
                    if(
                        (
                            Math.round(end - sidebar_rect.bottom) > 10
                        ) || (
                            sidebar_rect.top > topNavBarSpace && dist > -5 && dist < 5
                        )
                    ){
                        position = "fixed"
                        sidebar.style.position = position
                        sidebar.style.top = topNavBarSpace + "px"
                    }else{
                        position = "absolute"
                        sidebar.style.position = position
                        sidebar.style.top = (window.scrollY + end - sidebar.clientHeight) + "px"
                    }
                }else{
                    position = "absolute"
                    sidebar.style.position = position
                    sidebar.style.top = topPosition
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
                            sidebar.querySelector(".nav-tree-wrapper").classList.add("faded")
                        }else{
                            sidebar.querySelector(".nav-tree-wrapper").classList.remove("faded")
                        }
                    }
                }
            }
            sidebar.style.visibility = 'visible'
        }

        document.addEventListener("scroll", handleScroll)

        window.addEventListener("resize", function(){
            if(window.innerWidth < 972){
                sidebar.style.position = "static"
            }else{
                sidebar.style.position = position
                document.body.classList.remove("pushy-open-left")
            }
            handleScroll()
        })
    }

};

module.exports = StickyKitInit;
