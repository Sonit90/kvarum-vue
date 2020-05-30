export default {
  methods:{
    getNodeByKey (key, firms) {
      const reduce = [].reduce

      const find = (result, node) => {
        if (result || !node) {
          return result
        }
        if (Array.isArray(node)) {
          return reduce.call(Object(node), find, result)
        }
        if (node['id'] === key) {
          return node
        }
        if (node.children) {
          return find(null, node.children)
        }
      }

      return find(null, firms)
    }
  }
}
