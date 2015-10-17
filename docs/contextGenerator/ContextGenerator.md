<div id="table-of-contents">
<h2>Table of Contents</h2>
<div id="text-table-of-contents">
<ul>
<li><a href="#sec-1">1. ContextGenerator</a>
<ul>
<li><a href="#sec-1-1">1.1. Frameworks</a></li>
<li><a href="#sec-1-2">1.2. Extensibility</a>
<ul>
<li><a href="#sec-1-2-1">1.2.1. Communication protocols</a></li>
<li><a href="#sec-1-2-2">1.2.2. Context modeling</a></li>
</ul>
</li>
</ul>
</li>
</ul>
</div>
</div>

# ContextGenerator<a id="sec-1" name="sec-1"></a>

The ContextGenerator is responsible for the **observation** and **aggregation** of
context information sent from CPSs. Third party applications may use the
context information provided by the ContextGenerator and react to context
changes that happen in an observed CPS. The ContextGenerator is a server
application that connects with CPSs by supporting multiple communication
protocols. It provides an interface for a dynamic creation of context data
models for CPSs. Context data models are abstractions of CPSs, that can
represent the state of a CPS at several points of time.

## Frameworks<a id="sec-1-1" name="sec-1-1"></a>

-   **Web:** [Express](http://expressjs.com)

## Extensibility<a id="sec-1-2" name="sec-1-2"></a>

### Communication protocols<a id="sec-1-2-1" name="sec-1-2-1"></a>

New communication protocols can be added by following two steps:

1.  Create subclass of `ContextLifeCycle/Acquisition/CPSConnection` with the implementation for the protocol.
2.  Extend the `ContextLifeCycle/Acquisition/ConnectionFactory` to use your protocol implementation.

### Context modeling<a id="sec-1-2-2" name="sec-1-2-2"></a>

Contexts are modeled according to the modeling attribute of a `Subscription`,
this can be customized following these steps:

1.  Create subclass of `ContextLifeCycle/Acquisition/Transformer` with the implementation for a custom transformer.
2.  Extend the `ContextLifeCycle/Acquisition/TransformerFactory` to use your transformer implementation.