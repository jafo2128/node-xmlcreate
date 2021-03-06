/**
 * Copyright (C) 2016 Michael Kourlas
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {assert} from "chai";
import XmlNode from "../../../lib/nodes/XmlNode";

describe("XmlNode", () => {
    describe("#parent", () => {
        it("should return undefined if this node has no parent", () => {
            const node = new XmlNode();
            assert.isUndefined(node.parent);
        });

        it("should return this node's parent if this node has a parent", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(childNode);
            assert.strictEqual(childNode.parent, parentNode);
        });
    });

    describe("#children", () => {
        it("should return an empty array if this node has no children", () => {
            const node = new XmlNode();
            assert.instanceOf(node.children(), Array);
            assert.strictEqual(node.children().length, 0);
        });

        it("should return an array containing this node's children", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            const secondChildNode = new XmlNode();
            parentNode.insertChild(childNode);
            parentNode.insertChild(secondChildNode);
            assert.strictEqual(parentNode.children().length, 2);
            assert.strictEqual(parentNode.children()[0], childNode);
            assert.strictEqual(parentNode.children()[1], secondChildNode);
        });

        it("should return a copy of the array containing this node's"
           + " children, not the original", () => {
            const node = new XmlNode();
            assert.notStrictEqual(node.children(), node.children());
        });
    });

    describe("#insertChild", () => {
        it("should throw an error if the specified node is not an"
           + " XmlNode", () => {
            const node = new XmlNode();
            assert.throws((): XmlNode | undefined => node.insertChild(
                undefined as any));
            assert.throws((): XmlNode | undefined => node.insertChild(
                null as any));
            assert.throws((): XmlNode | undefined => node.insertChild(
                0 as any));
            assert.throws((): XmlNode | undefined => node.insertChild(
                "error" as any));
        });

        it("should throw an error if the specified index is not an"
           + " integer", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            assert.throws((): XmlNode | undefined => parentNode.insertChild(
                childNode, null as any));
            assert.throws((): XmlNode | undefined => parentNode.insertChild(
                childNode, "error" as any));
            assert.throws((): XmlNode | undefined => parentNode.insertChild(
                childNode, 3.3));
        });

        it("should throw an error if the specified index is not within the"
           + " bounds of this node's children", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            const secondChildNode = new XmlNode();
            parentNode.insertChild(childNode, 0);
            assert.throws(() => parentNode.insertChild(secondChildNode, -1));
            assert.throws(() => parentNode.insertChild(
                secondChildNode, parentNode.children().length + 1));
        });

        it("should insert the specified node at the appropriate location in"
           + " this node's children, set the specified node's parent field to"
           + " this node, and return the specified node", () => {
            const parentNode = new XmlNode();
            for (let i = 0; i < 10; i++) {
                parentNode.insertChild(new XmlNode());
            }
            const childNode = new XmlNode();
            assert.strictEqual(parentNode.insertChild(childNode, 0), childNode);
            assert.strictEqual(parentNode.children()[0], childNode);
            assert.strictEqual(childNode.parent, parentNode);
            const secondChildNode = new XmlNode();
            assert.strictEqual(parentNode.insertChild(secondChildNode, 3),
                               secondChildNode);
            assert.strictEqual(parentNode.children()[3], secondChildNode);
            assert.strictEqual(secondChildNode.parent, parentNode);
            const thirdChildNode = new XmlNode();
            assert.strictEqual(parentNode.insertChild(
                thirdChildNode, parentNode.children().length), thirdChildNode);
            assert.strictEqual(
                parentNode.children()[parentNode.children().length - 1],
                thirdChildNode);
            assert.strictEqual(thirdChildNode.parent, parentNode);
        });

        it("should insert the specified node at the end of this node's"
           + " children if no index is specified and return the specified"
           + " node", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            const secondChildNode = new XmlNode();
            assert.strictEqual(parentNode.insertChild(childNode, 0), childNode);
            assert.strictEqual(parentNode.insertChild(secondChildNode),
                               secondChildNode);
            assert.strictEqual(
                parentNode.children()[parentNode.children().length - 1],
                secondChildNode);
        });

        it("should do nothing and return undefined if the specified node is"
           + " already a child of this node", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            const secondChildNode = new XmlNode();
            assert.strictEqual(parentNode.insertChild(childNode), childNode);
            assert.strictEqual(parentNode.insertChild(secondChildNode),
                               secondChildNode);
            assert.isUndefined(parentNode.insertChild(childNode, 1));
            assert.strictEqual(parentNode.children().length, 2);
            assert.strictEqual(parentNode.children()[0], childNode);
            assert.strictEqual(parentNode.children()[1], secondChildNode);
        });
    });

    describe("#next", () => {
        it("should return undefined if this node has no parent", () => {
            const node = new XmlNode();
            assert.isUndefined(node.next());
        });

        it("should return undefined if this node is the last of its parent's"
           + " children", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(new XmlNode());
            parentNode.insertChild(childNode);
            assert.isUndefined(childNode.next());
        });

        it("should return this node's parent's second child if this node is"
           + " the first of its parent's children", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            const secondChildNode = new XmlNode();
            parentNode.insertChild(childNode);
            parentNode.insertChild(secondChildNode);
            assert.strictEqual(childNode.next(), secondChildNode);
        });
    });

    describe("#prev", () => {
        it("should return undefined if this node has no parent", () => {
            const node = new XmlNode();
            assert.isUndefined(node.prev());
        });

        it("should return undefined if this node is the first of its parent's"
           + " children", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(childNode);
            parentNode.insertChild(new XmlNode());
            assert.isUndefined(childNode.prev());
        });

        it("should return this node's parent's first child if this node is"
           + " the second of its parent's children", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            const secondChildNode = new XmlNode();
            parentNode.insertChild(childNode);
            parentNode.insertChild(secondChildNode);
            assert.strictEqual(secondChildNode.prev(), childNode);
        });
    });

    describe("#remove", () => {
        it("should remove this node from its parent's children, set this"
           + " node's parent field to undefined, and return the parent", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(childNode);
            assert.strictEqual(childNode.remove(), parentNode);
            assert.strictEqual(parentNode.children().length, 0);
            assert.isUndefined(childNode.parent);
        });

        it("should leave this node's parent field unchanged and return"
           + " undefined if this node has no parent", () => {
            const childNode = new XmlNode();
            assert.isUndefined(childNode.remove());
            assert.isUndefined(childNode.parent);
        });
    });

    describe("#removeChild", () => {
        it("should throw an error if the specified node is not an"
           + " XmlNode", () => {
            const node = new XmlNode();
            assert.throws((): boolean => node.removeChild(undefined as any));
            assert.throws((): boolean => node.removeChild(null as any));
            assert.throws((): boolean => node.removeChild(0 as any));
            assert.throws((): boolean => node.removeChild("error" as any));
        });

        it("should do nothing and return false if the specified node is not"
           + " a child of this node", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(childNode);
            const node = new XmlNode();
            assert.isFalse(parentNode.removeChild(node));
            assert.strictEqual(parentNode.children().length, 1);
            assert.strictEqual(parentNode.children()[0], childNode);
        });

        it("should remove the specified node from this node's children, set"
           + " the specified node's parent field to undefined, and return"
           + " true", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(childNode);
            assert.isTrue(parentNode.removeChild(childNode));
            assert.strictEqual(parentNode.children().length, 0);
            assert.isUndefined(childNode.parent);
        });
    });

    describe("#removeChildAtIndex", () => {
        it("should throw an error if the specified index is not an"
           + " integer or undefined", () => {
            const node = new XmlNode();
            assert.throws((): XmlNode => node.removeChildAtIndex(null as any));
            assert.throws(
                (): XmlNode => node.removeChildAtIndex("error" as any));
            assert.throws((): XmlNode => node.removeChildAtIndex(3.3));
        });

        it("should throw an error if the specified index is not within the"
           + " bounds of this node's children", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(childNode, 0);
            assert.throws(() => parentNode.removeChildAtIndex(-1));
            assert.throws(() => parentNode.removeChildAtIndex(
                parentNode.children().length));
        });

        it("should remove the node at the specified index from this node's"
           + " children, set that node's parent field to undefined, and return"
           + " that node", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(childNode);
            assert.strictEqual(parentNode.removeChildAtIndex(0), childNode);
            assert.strictEqual(parentNode.children().length, 0);
            assert.isUndefined(childNode.parent);
        });
    });

    describe("#toString", () => {
        it("should throw an error", () => {
            const node = new XmlNode();
            assert.throws(() => node.toString());
        });
    });

    describe("#top", () => {
        it("should return the parent of this node's parent if that node has"
           + " no parent", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(childNode);
            const grandChildNode = new XmlNode();
            childNode.insertChild(grandChildNode);
            assert.strictEqual(grandChildNode.top(), parentNode);
        });

        it("should return the parent of this node if that node has no"
           + " parent", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(childNode);
            assert.strictEqual(childNode.top(), parentNode);
        });

        it("should return this node if this node has no parent", () => {
            const node = new XmlNode();
            assert.strictEqual(node.top(), node);
        });
    });

    describe("#up", () => {
        it("should return undefined if this node has no parent", () => {
            const node = new XmlNode();
            assert.isUndefined(node.up());
        });

        it("should return this node's parent if this node has a parent", () => {
            const parentNode = new XmlNode();
            const childNode = new XmlNode();
            parentNode.insertChild(childNode);
            assert.strictEqual(childNode.up(), parentNode);
        });
    });
});
