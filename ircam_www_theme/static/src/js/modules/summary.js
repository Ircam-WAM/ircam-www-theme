var Summary = function() {

    //
    // Init
    //
    this.init();

};

Summary.prototype.init = function() {

    var links = document.getElementsByClassName("nav-page-link")

    if(links.length > 0){

        var slows = document.getElementsByClassName("slow-move")
        for(var s in slows){
            if(typeof slows[s] == "object"){
                slows[s].addEventListener('click', function(e) {
                    e.preventDefault()
                    var self = $(this);
                    $('html, body').animate({
                        scrollTop:$(self.attr('href')).offset().top
                    }, 'slow');
                    window.history.replaceState({}, '', self.attr('href'))
                    return false;
                });
            }
        }

        var lastMenuItemSelected = null

        var linkObj = []
        for(var l in links){
            if(typeof links[l] == "object"){
                var id = links[l].getAttribute("href").replace("#", "")
                linkObj.push(
                    [
                        links[l],
                        document.getElementById(id)
                    ]
                )
            }
        }
        linkObj.sort(function(first, second){
            return first[1] - second[1]
        })

        document.addEventListener("scroll", function(e){

            var topBottoms = []

            for(var o in linkObj){
                topBottoms.push([
                    linkObj[o][0],
                    linkObj[o][1].getBoundingClientRect(),
                ])
            }

            if(topBottoms[0][1].top <= 0 && topBottoms[topBottoms.length-1][1].bottom >= 0){
                for(var l in topBottoms){
                    if(
                        topBottoms[l][1].top <= 30 && topBottoms[l][1].bottom >= 30
                    ){
                        if(lastMenuItemSelected != topBottoms[l][0]){
                            topBottoms[l][0].classList.add("active")
                            if(lastMenuItemSelected != null){
                                lastMenuItemSelected.classList.remove("active")
                            }
                            lastMenuItemSelected = topBottoms[l][0]
                        }else{
                            break;
                        }
                    }
                }
            }else{
                for(var l in topBottoms){
                    topBottoms[l][0].classList.remove("active")
                }
                lastMenuItemSelected = null
            }
        });
    }
};

module.exports = Summary;
