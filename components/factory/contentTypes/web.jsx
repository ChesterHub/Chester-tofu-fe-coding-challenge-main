import React, { useEffect, useRef, useState } from "react";
import Spinner from "@/components/core/spinner";

const WEBSITE_IFRAME_HTML_ID = "website-iframe";

const Web = () => {
  const iframeRef = useRef(null);
  const iframeDoc = useRef(null);
  const [htmlContent, setHtmlContent] = useState(null);
  const [fetchingHtml, setFetchingHtml] = useState(false);

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
      // Scrape the values
      const tagName = clickedElement.tagName
      const textContent = clickedElement.textContent
      const tofuId = clickedElement.getAttribute("data-tofu-id")
      console.log(clickedElement.outerHTML)
      alert(`You clicked on:${tagName}, ${textContent}, ${tofuId}`)
    }
  }
  
  useEffect(() => {
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
              border: 2px solid orange;
              content: "";
            }
          `;
          iframeDoc.current.head.appendChild(style);
  
          // Add click event listener for tofu elements
          iframeDoc.current.addEventListener("click", handleElementClick)
        }
      }
    };
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
