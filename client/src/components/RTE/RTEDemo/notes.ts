/* 

^ A lot of the data-* attributes on both custom and built-in
^ lexical nodes' exportDom() methods are highly specific to lexical's internal logic. They are often used 
^ by the importDOM() methods on lexical nodes when passing the HTML back into the editor. This means that
^ if one day you decide to switch editors you'll likely run into formatting issues with prexisting content.
^ I don't know of any way to avoid this and it would likely occur when switching editors regardless of which
^ which one you started with. I think the only solution is to have a deep understanding of the behavior of 
^ each editor's logic and then probably do some kind of database bulk update that converted the attributes in the
^ original HTML strings to whatever was needed to look correct in the the new editor.
^ This is also a really good argument for choosing wisely.


You've raised an important and often overlooked issue in the world of rich text editors. This problem is indeed a known challenge when switching between different rich text editors. Let's break down the issue and discuss some potential mitigation strategies:

1. Confirmation of the issue:
Yes, this is a known problem when transitioning between different rich text editors. Each editor often has its own internal representation of content, custom attributes, and specific ways of handling formatting and structure.

2. Common challenges:
   - Custom data attributes (e.g., data-* attributes)
   - Editor-specific class names
   - Differences in HTML structure for complex elements (e.g., tables, lists)
   - Handling of whitespace and line breaks
   - Custom elements or components


3. Mitigation strategies:

a. Use a standardized format:
   - Store content in a more neutral format like Markdown or a simplified HTML subset.
   - This approach sacrifices some advanced formatting but ensures better compatibility.

b. Create a conversion layer:
   - Develop a middleware that converts content between editor-specific formats.
   - This could be a set of transformation functions that map attributes and structures from one editor to another.

c. Implement a custom serialization format:
   - Design your own JSON-based format that captures all necessary formatting and structure.
   - Implement import/export functions for each editor you might use.

d. Use a headless editor framework:
   - Consider using a framework like ProseMirror or Slate that separates the data model from the view.
   - This approach allows you to maintain a consistent data structure while potentially switching out the UI layer.

e. Perform a one-time migration:
   - If switching editors, write a script to bulk convert all existing content to the new format.
   - This is often necessary and can be combined with other strategies.

f. Gradual transition:
   - Maintain support for multiple formats during a transition period.
   - Slowly migrate content to the new format as it's edited or accessed.

g. Focus on semantic structure:
   - When possible, use semantic HTML elements and classes rather than editor-specific attributes.
   - This approach makes content more portable between different systems.


4. Best practices:
   - Document your content structure and any custom attributes thoroughly.
   - Regularly export and backup content in a raw format (e.g., HTML or Markdown).
   - Consider the potential for future migrations when choosing an editor or designing your content structure.
   - Implement a content versioning system to track changes in format over time.

5. Long-term considerations:
   - Evaluate editors not just on features, but also on their export capabilities and adherence to standards.
   - Consider the longevity and community support of the editor you choose.
   - Plan for potential migrations from the start, even if you don't anticipate switching editors soon.

While there's no perfect solution that eliminates all migration challenges, a combination of these strategies can significantly reduce the pain of transitioning between editors. The key is to plan ahead, maintain flexibility in your content structure, and prioritize standardization where possible.
Evaluate editors not just on features, but also on their export capabilities and adherence to standards.
Consider the longevity and community support of the editor you choose.
Plan for potential migrations from the start, even if you don't anticipate switching editors soon.
While there's no perfect solution that eliminates all migration challenges, a combination of these strategies can significantly reduce the pain of transitioning between editors. The key is to plan ahead, maintain flexibility in your content structure, and prioritize standardization where possible.
*/

/* ========================================================================
                         
======================================================================== */

/* ======================
    DOMPurify Tests
====================== */
// XSS attacts can occur through the following attack vectors:

// Attribute Injection: onclick, onerror, onsumbit, onfocus, onblur, onload, onunload,
// onscroll, onresize,  onmouseover, onmouseout, onkeydown, onkeyup, onkeypress,
// oncopy, onpaste, oncut, ondragstart, ondragend, ondrop, onwheel, nhashchange
// URL Injection: http://example.com/page?param=<script>alert('XSS')</script>
// JavaScript Injection: eval('var x = ' + userInput);
// CSS Injection: document.styleSheets[0].insertRule(userInput, 0);
// Event Handler Injection: document.styleSheets[0].insertRule(userInput, 0);

// DOMPurify removes onclick.
export const buttonTest = `
  <button 
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
    onclick="alert('You got hacked!')"
  >Click me</button>`

// DOMPurify removes the <script> tag.
// Also, in React when using dangerouslySetInnerHTML, the inner HTML is treated as a string
// and not directly parsed as DOM elements. As a result, the script tag is not executed.
export const scriptTest1 = `
  <p dir="ltr">
    <span style="white-space: pre-wrap;">This is the script test...</span>
    <script>console.log("You've beeen hacked!!!");</script>
  </p>`

// DOMPurify removes onblur and onclick.
export const inputTest = `
  <input 
    class="form-control form-control-sm" type="text" 
    onblur="console.log('You got hacked!');" 
    onclick="console.log('You got hacked!');" 
  />`

// DOMPurify removes onblur and onclick.
export const selectTest = `
  <select
    class="form-select form-select-sm" 
    onblur="console.log('You got hacked!');" 
    onclick="console.log('You got hacked!');" 
  />
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>`

// DOMPurify removes onblur and onclick.
export const textAreaTest = `
  <textarea
    class="form-control form-control-sm" 
    onblur="console.log('You got hacked!');" 
    onclick="console.log('You got hacked!');" 
  />`

// DOMPurify removes onsubmit.
export const formTest = `
<form onsubmit="event.preventDefault(); console.log('You got hacked!');">
  <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" type="submit">Submit</button>
</form>`

// DOMPurify removes onclick.
export const linkTest = `<a class="text-blue-500 hover:underline" href="#!" onclick="event.preventDefault(); console.log('You got hacked!');">goggle.com</a>`

// This did not cause an XSS attack.
export const linkTest2 = `
 <a 
   class="text-blue-500 hover:underline"
   href="https://www.google.com?param=<script>alert('XSS')</script>" 
   target="_blank"
  >Google</a>
`

export const imgTest = `<img src="image.jpg" onerror="console.log('You got image hacked!');">`

// This will not work even as JSX: <img src="javascript:alert('You got hacked')" alt='' />
// Browsers block this and give you back net::ERR_UNKNOWN_URL_SCHEME
// However, React also gives you a warning:
// A future version of React will block javascript: URLs as a security precaution.
export const imgTest2 = `<img src="javascript:alert('You got hacked')" alt="" />`

///////////////////////////////////////////////////////////////////////////
//
// First, modern browsers have implemented security measures to block javascript: URLs in CSS properties.
//
//   <div
//     style={{
//     width: '150px',
//       height: '150px',
//       backgroundColor: 'blue',
//       backgroundImage: 'url(\'javascript:alert("This is unsafe!")\')' //! => ERR_UNKNOWN_URL_SCHEME
//     }}
//   />
//
// Second dangerouslySetInnerHTML also has security measures in place to prevent the execution
// of malicious code. In this case, the style attribute's background-image property may
// not be interpreted as JavaScript code.
//
//   style="background-image: url('javascript:console.log('You got inline CSS hacked!');')"
//   style="background-image: url(&quot;javascript:console.log('You got inline CSS hacked!');&quot;);"
//
// In each case, I got net::ERR_UNKNOWN_URL_SCHEME.
//
// In any case, DOMPurify does not remove it.
//
///////////////////////////////////////////////////////////////////////////
export const divTest = `
<div 
  class="bg-blue-500 w-24 h-24 border border-blue-800 rounded block mx-auto"
  style="background-image: url(&quot;javascript:console.log('You got inline CSS hacked!');&quot;);"
/>`

// DOMPurify removes onload.
export const svgTest = `
<svg xmlns="http://www.w3.org/2000/svg" onload="alert('You got hacked!')">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="1" fill="red" />
</svg>`

/*

DOMPurify has a tags list found here: https://github.com/cure53/DOMPurify/blob/main/src/tags.js
Presumably, these are allowed tags. Notable HTML tags missing from this array include:

script
iframe
object
embed
applet
param
base
link
meta
title
frame
frameset
noframes
noscript
svg      // <svg> is not omitted. Rather, it's a special case, that is handled as its own category.
math
canvas
noembed

DOMPurify has an attributes list found here: https://github.com/cure53/DOMPurify/blob/main/src/attrs.js
Presumably, these are allowed attributes. Notable HTML attributes missing from this array include:

onclick
ondblclick
onmousedown
onmouseup
onmouseover
onmousemove
onmouseout
onkeypress
onkeydown
onkeyup
onload
onunload
onabort
onerror
onresize
onscroll
onselect
onchange
onsubmit
onreset
onfocus
onblur
oncontextmenu
oninput
oninvalid
onsearch
ondrag
ondragend
ondragenter
ondragleave
ondragover
ondragstart
ondrop
onmousewheel
onwheel
oncopy
oncut
onpaste
onplay
onpause
onplaying
onprogress
onratechange
onseeked
onseeking
onstalled
onsuspend
ontimeupdate
onvolumechange
onwaiting
ontoggle
onshow
onafterprint
onbeforeprint
onbeforeunload
onhashchange
onmessage
onoffline
ononline
onpagehide
onpageshow
onpopstate
onstorage
onanimationend
onanimationiteration
onanimationstart
ontransitionend
contenteditable
formaction
srcdoc
sandbox
allow
allowfullscreen
form
formenctype
formmethod
formnovalidate
formtarget
ping
referrerpolicy
data-  (Probably only seemingly malicious attributes)
javascript:
Note that this list includes event handler attributes, certain iframe-specific attributes, 
form-related attributes, and other potentially dangerous attributes. The data-* entry represents 
all custom data attributes. The javascript: entry refers to the JavaScript URL protocol that 
might be used in attributes like href. Remember that DOMPurify's actual behavior may be 
more nuanced and could change with updates. Always refer to the latest documentation or source code for the most accurate information.

interface Config {
        ADD_ATTR?: string[] | undefined;
        ADD_DATA_URI_TAGS?: string[] | undefined;
        ADD_TAGS?: string[] | undefined;
        ADD_URI_SAFE_ATTR?: string[] | undefined;
        ALLOW_ARIA_ATTR?: boolean | undefined;
        ALLOW_DATA_ATTR?: boolean | undefined;
        ALLOW_UNKNOWN_PROTOCOLS?: boolean | undefined;
        ALLOW_SELF_CLOSE_IN_ATTR?: boolean | undefined;
        ALLOWED_ATTR?: string[] | undefined;
        ALLOWED_TAGS?: string[] | undefined;
        ALLOWED_NAMESPACES?: string[] | undefined;
        ALLOWED_URI_REGEXP?: RegExp | undefined;
        FORBID_ATTR?: string[] | undefined;
        FORBID_CONTENTS?: string[] | undefined;
        FORBID_TAGS?: string[] | undefined;
        FORCE_BODY?: boolean | undefined;
        IN_PLACE?: boolean | undefined;
        KEEP_CONTENT?: boolean | undefined;
       
        NAMESPACE?: string | undefined;
        PARSER_MEDIA_TYPE?: string | undefined;
        RETURN_DOM_FRAGMENT?: boolean | undefined;
      
        RETURN_DOM_IMPORT?: boolean | undefined;
        RETURN_DOM?: boolean | undefined;
        RETURN_TRUSTED_TYPE?: boolean | undefined;
        SAFE_FOR_TEMPLATES?: boolean | undefined;
        SANITIZE_DOM?: boolean | undefined;
        SANITIZE_NAMED_PROPS?: boolean | undefined;
        USE_PROFILES?:
            | false
            | {
                mathMl?: boolean | undefined;
                svg?: boolean | undefined;
                svgFilters?: boolean | undefined;
                html?: boolean | undefined;
            }
            | undefined;
        WHOLE_DOCUMENT?: boolean | undefined;
        CUSTOM_ELEMENT_HANDLING?: {
            tagNameCheck?: RegExp | ((tagName: string) => boolean) | null | undefined;
            attributeNameCheck?: RegExp | ((lcName: string) => boolean) | null | undefined;
            allowCustomizedBuiltInElements?: boolean | undefined;
        };
    }
*/
