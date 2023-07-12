import Cell from "./cell.js";
// import Resistor from "./Resistor.js";
import VoltageSource from "./VoltageSource.js";
import CurrentSource from "./CurrentSource";
import Component from "./BasicComponent";
import NetItem from "./NetItem.js";
import Reference from "./Reference.js";
// import SendToPython from "./SendToPython.js";

//global var
let netnum;
let referenceNum;

export default class NodeVoltage {
    constructor(matrix) {
        this.matrix = matrix
        // console.log(this.matrix)
    }

    solve() {
        console.log('solving')
        //find a wire on the matrix
        let part = this.find_a_part()
        if (!(part instanceof Cell)) {
            alert('No Wires or Components Found!')
            return null
        }
        //get a list of all significant nodes
        let nodes = this.find_all_nodes(part)
        if (nodes instanceof Set) {
            // if nodes were found
            let y = 0
            let gnd;
            nodes.forEach(node => { // find the bottom most node in the list to designate as the ground node
                if (node.y > y) {
                    gnd = node
                    y = node.y
                }
                node.reference = null
            })
            gnd.reference = new Reference(0, gnd)
        }
        // Create a net list to be solved using PySpice
        let list = this.create_net_list(nodes)
        // console.log(list.length)

        let string = '' // string to become the netlist to send to python
        let reference_set = new Set() // add all references to this to be used when displaying values

        for(let i = 0; i <list.length ; i++) {
            console.log(list[i])
            this.check_orientation(list[i])
            list[i].create_string()
            string += list[i].string + '\n'
            reference_set.add(list[i].node1)
            reference_set.add(list[i].node2)
        }
        console.log('Netlist is')
        console.log(string)

        let reference_list = []
        reference_set.forEach(item => {
            reference_list.push(item)
        })

        // SendToPython(string, reference_list, list)
        console.log("WERE SENDING TO PYTHONNN");
    }

    find_a_part() {
        let height = this.matrix.length
        let width = this.matrix[0].length
        for (let i=0; i< height; i++) {
            for (let j=0; j<width; j++) {
                let cell = this.matrix[i][j]
                // console.log(cell.x, cell.y, cell.type)
                if ((cell.part === 'Wire') || (cell.part === 'Component')) {
                    console.log('found ', cell.x, cell.y)
                    return cell
                }
            }
        }
        return null
    }

    find_all_nodes(part) {
        /**
         * Based on one cell, go through the entire group of connected cells and mark all significant nodes in a set
         *
         */
            //starting with any cell
            //if the number of directions possible is 1 or 2, go until finding a node
            // if the number is 3 or >3, you're already there
            // console.log('running find_all_nodes method')
        let current_cell = part
        let seen = new Set()
        let value = current_cell.connected_parts.size
        let connection_count = 0
        while (value < 3) { //keep going until a node is found
            // console.log(current_cell.x, current_cell.y, current_cell.type)
            // console.log(current_cell.connected_parts.size)
            seen.add(current_cell) //mark the current cell as seen as to not come back to it
            connection_count = 0
            if (current_cell.connected_parts.size >= 2) {
                // console.log('running if statement')
                current_cell.connected_parts.forEach(direction_cell => { // check in all directions
                    connection_count += 1
                    if (!seen.has(direction_cell)) {
                        if (direction_cell.connected_parts.size >= 2) { // if the connected cell is a node
                            current_cell = direction_cell // become the node
                            connection_count = 0
                            value = current_cell.connected_parts.size
                        } else {
                            alert('Open circuit detected')
                            value = 3
                        }
                    }
                })
                if(connection_count === current_cell.connected_parts.size) {
                    value = 3
                }
            } else {
                alert('Open circuit detected 2')
                value = 3 // break the while loop
            }
        }
        // alert('Successfully exited while loop')
        //now current_cell is a node if nodes are present
        // if no node was found, there are no nodes, return an empty Set
        if (current_cell.connected_parts.size < 3) {
            alert('no nodes detected')
            return current_cell
        } else {
            seen.clear()
            let x = this.node_search(current_cell, seen)
            console.log(x.size, ' nodes found')
            // x.forEach(node => {
            //     console.log('node at', node.x, node.y)
            // })
            return x
        }
    }

    node_search(node, seen_set, nodes_set=new Set()) {
        /**
         * from any one given node, find a list of nodes that are directly connected
         */
        //starting at a node, go through each possible direction until finding another node that hasn't been seen before
        //     console.log('running node search method')
        //start at a node
        //for each surrounding direction
        // console.log('node searching ', node.x, node.y)
        seen_set.add(node)
        if (node.connected_parts.size >= 3) {
            nodes_set.add(node)
            // console.log('found a node at ', node.x, node.y)
            // console.log('the parts it is connected to are: ')
            // node.connected_parts.forEach(cn => {
            //     console.log(cn.x, cn.y, cn.type)
            // })
        }
        node.connected_parts.forEach(connected_cell => {
            //if not already seen
            if (!(seen_set.has(connected_cell))) {
                this.node_search(connected_cell, seen_set, nodes_set)
            }
        })
        return nodes_set
    }

    create_net_list(nodes) {
        // Now with a set of 'significant nodes' we must create a net list, however, the way net list references nodes
        // are different than the way we do: there also must be nodes in between any series connected components so that
        // we can differentiate parts in series and parallel. To avoid confusion, we will call the net list version of
        // nodes 'references'
        let seen = new Set()
        let list = [];
        referenceNum = 1
        netnum = 1
        if (!(nodes instanceof Set)) {
            list = this.netitems_from_wire(nodes, seen)
        } else {
            nodes.forEach(node => {
                let newList = this.netitems_from_node(node, seen)
                list = list.concat(newList)
            })
        }
        return list
    }

    netitems_from_wire(wire, seen) {
        let netItems = []
        let items = []
        seen.add(wire)
        const [direction] = wire.connected_parts // start in a direction to go
        let nextItem = this.direction_recurse(direction, seen, wire)
        while (!(netItems.includes(nextItem))) {
            items.push(nextItem)
            nextItem.connected_parts.forEach(connected => {
                seen.add(nextItem)
                if (!(seen.has(connected))) {
                    nextItem = this.direction_recurse(connected, seen, wire)
                }
            })
            if (items.includes(nextItem)) {
                break
            }
        }
        console.log('out of while')
        console.log(items)
        // create a damn netlist
        if (items.size === 0) {
            alert('hey add something that does something here')
        }
        console.log('creating a new ref 5')
        // let firstRef = new Reference(referenceNum, wire)
        let firstRef = new Reference(0, wire)
        // referenceNum += 1
        let prevRef = firstRef
        for (let i = 0; i < items.length; i++) {
            let netitem = new NetItem(items[i], netnum)
            netnum += 1
            netitem.node1 = prevRef

            if (i === (items.length - 1)) {
                console.log('setting reference')
                console.log(wire.reference)
                netitem.node2 = firstRef
            } else {
                console.log('new ref created 4')
                let inBetween = new Reference(referenceNum, netitem.component)

                referenceNum += 1
                netitem.node2 = inBetween
                prevRef = inBetween
                netitem.component.reference = inBetween
                console.log('ran:', netitem.component.reference)
            }
            netItems.push(netitem)
        }

        return netItems
    }

    netitems_from_node(node, seen) {
        //takes a node and a seen set and returns a list of netitems (class NetItem) coming from said node
        seen.add(node)
        if (!(node.reference instanceof Reference)) {
            console.log('new ref created')
            node.reference = new Reference(referenceNum, node)
            referenceNum += 1
        }

        let netItems = []
        node.connected_parts.forEach(direction => {
            let prevRef = node.reference
            if (!(seen.has(direction))) {
                let itemList = []
                // console.log('running direction recurse initially')
                let nextItem = this.direction_recurse(direction, seen, node) // go until finding another node or comp
                let whileruns = 0
                while ((nextItem instanceof Component) && (whileruns < 100)) { // dont run infinitely, wires wont be that long
                    whileruns += 1
                    itemList.push(nextItem)
                    nextItem.connected_parts.forEach(connected => {
                        // console.log(connected.x, connected.y)
                        if (!(seen.has(connected))) {
                            nextItem = this.direction_recurse(connected, seen, node)
                        } else if ((connected.connected_parts.size >= 3) && (connected !== node)) {
                            // console.log('running else if')
                            nextItem = connected
                        }

                    })
                }
                // console.log('exited while')
                // console.log(itemList.length)
                //now itemList should contain all the list of components in a direction and nextItem should be the connected node
                if (itemList.size === 0) {
                    alert('hey add something that does something here')
                }
                if (nextItem.reference === null) {
                    console.log('new ref created 2')
                    nextItem.reference = new Reference(referenceNum, nextItem)
                    referenceNum += 1
                }
                for (let i = 0; i < itemList.length; i++) {
                    let netitem = new NetItem(itemList[i], netnum)
                    netnum += 1
                    netitem.node1 = prevRef

                    if (i === (itemList.length - 1)) {
                        netitem.node2 = nextItem.reference
                    } else {
                        console.log('new ref created 3')
                        let inBetween = new Reference(referenceNum, netitem.component)

                        referenceNum += 1
                        netitem.node2 = inBetween
                        netitem.component.reference =  inBetween
                        prevRef = inBetween
                        console.log('ran: ', inBetween)
                    }
                    netItems.push(netitem)
                }
            }
        })
        return netItems
    }

    direction_recurse(direction, seen, node) {
        /**
         * called in a direction of a node/wire and returns the next appearing component or node
         */
        // console.log('direction recursing at', direction.x, direction.y)
        seen.add(direction)
        if ((direction instanceof Component) || (direction.connected_parts.size >= 3)) {
            // console.log('im a component or a node!')
            // console.log('returning', direction.x, direction.y)
            return direction
        } else {
            let array = []
            direction.connected_parts.forEach(cd => {
                array.push(cd)
            })
            for (let i=0; i < array.length; i++) {
                if (!(seen.has(array[i]))) { // if the connected direction hasn't been seen
                    // console.log('i havent yet seen', array[i].x, array[i].y)
                    let recursive = this.direction_recurse(array[i], seen, node) // recursively call the function on that cell
                    // console.log('successfully recursed back to', direction.x, direction.y)
                    // console.log(recursive.type)
                    // console.log('returning', recursive.x, recursive.y, 'after running', direction.x, direction.y, 'and iterating by', array[i].x, array[i].y)
                    return recursive // return whatever is returned by said cell
                } else if (((array[i].connected_parts.size >= 3)) && (array[i] !== node)) {
                    // console.log('ive already seen', array[i].x, array[i].y, 'but its a node')
                    return array[i]
                }
            }
        }
        // returning to the original node (occurs when no nodes are in circuit)
        return node
        // throw Error('Somehow didnt return any value in direction_recurse meaning that the direction checked was not a node or a component, none of its connected parts are nodes or components, and recursion doesnt find anything')
    }

    check_orientation(NetItem) {
        let comp = NetItem.component
        console.log('checking orientation at', comp.x, comp.y)
        if ((comp instanceof VoltageSource) || (comp instanceof CurrentSource)) {
            console.log('its a source!')
            let seen = new Set()
            seen.add(comp)
            let checkCell = comp.find_cell(comp.orientation)
            let next = this.direction_recurse(checkCell, seen, comp)
            console.log('after checking in direction', comp.orientation, 'at cell', checkCell.x, checkCell.y)
            console.log('the next item found was', next.x, next.y)
            if (next.reference === NetItem.node1) {
                console.log('the wrong node was found, flipping...')
                NetItem.flip_nodes()
            }
        }
        return null
    }
}