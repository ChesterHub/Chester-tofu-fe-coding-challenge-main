import React, { useEffect, useRef, useState } from "react";
import Spinner from "@/components/core/spinner";

const WEBSITE_IFRAME_HTML_ID = "website-iframe";


const Web = ({ selectedComponents, addComponent, removeComponent }) => {
  const iframeRef = useRef(null);
  const iframeDoc = useRef(null); // allows us to removeEventListener from iframe in useEffect
  const selectedComponentsRef = useRef(null)
  const [htmlContent, setHtmlContent] = useState(null);
  const [fetchingHtml, setFetchingHtml] = useState(false);

  useEffect(() => {
    selectedComponentsRef.current = selectedComponents
  }, [selectedComponents]);

  const fetchAndSetHtml = async (url) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      setHtmlContent(html);
    } catch (error) {
      console.error("Error fetching HTML:", error);
    } finally {
      setFetchingHtml(false);
    }
  };

  const handleElementClick = (event) => {
    const clickedElement = event.target

    // Check if the clicked element has the 'tofu-element' class
    if (clickedElement.classList.contains("tofu-element")) {
      const tofuId = clickedElement.getAttribute("data-tofu-id")
      //check if component already in list
      if (selectedComponentsRef.current.some(c => c.id === tofuId)) {
        clickedElement.style.border = null
        removeComponent(tofuId)
      } else {
          const tagName = clickedElement.tagName
          const textContent = clickedElement.innerText
          clickedElement.style.border = "2px solid orange"
    
          const newComponent = {
            id: tofuId,
            html_tag: tagName,
            selected_element: clickedElement.outerHTML,
            text: textContent,
          }
          addComponent(newComponent)
      }

    }
  }

  const initDisplayContent = async () => {
    setFetchingHtml(true);
    await fetchAndSetHtml("/landing-page.html");

    const iframe = iframeRef.current

    iframe.onload = () => {
      iframeDoc.current = iframe.contentDocument || iframe.contentWindow.document

      if (iframeDoc.current) {
        const style = iframeDoc.current.createElement("style")
        style.innerHTML = `
          .tofu-element:hover {
            border: 2px dashed orange;
            content: "";
          }
        `;
        iframeDoc.current.head.appendChild(style);

        // Add click event listener for tofu elements
        iframeDoc.current.addEventListener("click", handleElementClick)
      }
    }
  };
  
  useEffect(() => {
    initDisplayContent()

    return () => {
      if (iframeDoc.current) iframeDoc.current.removeEventListener("click", handleElementClick)
    }
  }, []);

  return (
    <>
      <div className="relative w-full h-full">
        {fetchingHtml && (
          <div className="absolute left-0 w-full h-full bg-white">
            <Spinner className="flex justify-center items-center h-40" />
          </div>
        )}
        <iframe
          id={WEBSITE_IFRAME_HTML_ID}
          srcDoc={htmlContent}
          className="w-full h-full"
          ref={iframeRef}
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts"
        ></iframe>
      </div>
    </>
  );
};

export default Web;
