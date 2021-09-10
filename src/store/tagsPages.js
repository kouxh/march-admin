const tagsPages = {

    state: {
        //路由列表
        tagsPages: []
    },

    mutations: {

        //添加路由
        ADD_PAGE(state, page) {
            //判断路由是否已经在列表中，如果存在，不再添加到列表中
            if (state.tagsPages.some(item => item.path == page.path))
                return;
            //添加路由到列表中
            state.tagsPages.push({
                name: page.name,
                title: page.meta.title,
                path: page.path
            })
        },
        //删除路由
        DEL_PAGE(state, page) {

            for (let [i, p] of state.tagsPages.entries()) {
                if (p.path == page.path) {
                    state.tagsPages.splice(i, 1)
                    break
                }
            }
        }
    },

    actions: {
        //添加路由
        addPage({ commit }, page) {
            console.log(page)
            commit("ADD_PAGE", page)
        },

        //删除路由
        delPage({ commit, state }, page) {
            return new Promise((resolve) => {
                commit("DEL_PAGE", page)
                resolve([...state.tagsPages])
            })
        }
    }
}
export default tagsPages