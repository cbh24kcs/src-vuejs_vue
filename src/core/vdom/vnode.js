/* @flow */

export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: Array<VNode> | void;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  child: Component | void; // component instance
  parent: VNode | void; // compoennt placeholder node
  raw: ?boolean; // contains raw HTML? (server only)
  isStatic: ?boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean;

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: Array<VNode> | void,
    text?: string,
    elm?: Node,
    ns?: string | void,
    context?: Component,
    componentOptions?: VNodeComponentOptions
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = ns
    this.context = context
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.child = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    // apply construct hook.
    // this is applied during render, before patch happens.
    // unlike other hooks, this is applied on both client and server.
    const constructHook = data && data.hook && data.hook.construct
    if (constructHook) {
      constructHook(this)
    }
  }
}

export const emptyVNode = () => {
  const node = new VNode()
  node.text = ''
  node.isComment = true
  return node
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.ns,
    vnode.context,
    vnode.componentOptions
  )
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  return cloned
}

export function cloneVNodes (vnodes: Array<VNode>): Array<VNode> {
  const res = new Array(vnodes.length)
  for (let i = 0; i < vnodes.length; i++) {
    res[i] = cloneVNode(vnodes[i])
  }
  return res
}