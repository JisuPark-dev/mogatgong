/*
*   공통으로 사용되는 이벤트 메소드 유틸
* */

export default {
    onScroll(target: any, idx: any, total: any, maxHeight: number = 0) {
        if(idx === 1) {
            target.scrollTo({
                top: 0,
            })
        } else if(idx === total) {
            target.scrollTo({
                top: target.scrollHeight,
            })
        } else {
            if(target.children[idx-1].offsetTop > (maxHeight)/2) {
                target.scrollTo({
                    top: Math.abs((maxHeight)/2 - target.children[idx-1].offsetTop),
                    behavior: 'smooth'
                })
            }
        }
    }

}